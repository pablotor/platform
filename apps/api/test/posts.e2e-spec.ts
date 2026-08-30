/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { signUpAndAuthenticate } from './auth-helpers';
import { cleanDatabase } from './db-helpers';
import { buildTestPost } from './posts-helpers';

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    prisma = moduleRef.get(PrismaService);
  });

  afterEach(async () => {
    await cleanDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('route protection', () => {
    // The controller spec's guard is a test double (see
    // test/controller-test-app.ts) that never verifies the real
    // @AllowAnonymous()/BetterAuth guard wiring — only this layer does.
    it('rejects an unauthenticated create request with 401', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts')
        .send(buildTestPost());

      expect(res.status).toBe(401);
    });

    it('requires authentication to list or fetch your own posts', async () => {
      const listRes = await request(app.getHttpServer()).get('/posts');
      expect(listRes.status).toBe(401);

      const getRes = await request(app.getHttpServer()).get('/posts/some-id');
      expect(getRes.status).toBe(401);
    });

    it('does not require authentication to list or read published posts', async () => {
      const listRes = await request(app.getHttpServer()).get('/public/posts');
      expect(listRes.status).toBe(200);

      // 404 (not 401) proves the route itself is reachable without auth —
      // the slug just doesn't exist.
      const getRes = await request(app.getHttpServer()).get(
        '/public/posts/missing',
      );
      expect(getRes.status).toBe(404);
    });
  });

  describe('create → edit → get-by-id round trip', () => {
    it('lets the author create, put, and then fetch the post by id', async () => {
      const { agent } = await signUpAndAuthenticate(app);
      const post = buildTestPost();

      const createRes = await agent.post('/posts').send(post);
      expect(createRes.status).toBe(201);
      const { id, slug } = createRes.body;

      const putRes = await agent
        .put(`/posts/${id}`)
        .send({ title: 'Updated title' });
      expect(putRes.status).toBe(200);
      expect(putRes.body.title).toBe('Updated title');

      // Slug isn't part of the payload above, so it stays put — this also
      // proves slug immutability under partial updates as a side effect.
      const getRes = await agent.get(`/posts/${id}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.title).toBe('Updated title');
      expect(getRes.body.slug).toBe(slug);
    });
  });

  describe('ownership', () => {
    it('returns 404 when a different user attempts to fetch the post by id', async () => {
      const { agent: authorAgent } = await signUpAndAuthenticate(app);
      const { agent: otherAgent } = await signUpAndAuthenticate(app);

      const createRes = await authorAgent.post('/posts').send(buildTestPost());
      const { id } = createRes.body;

      const getRes = await otherAgent.get(`/posts/${id}`);
      expect(getRes.status).toBe(404);
    });

    it('returns 404 when a different user attempts to edit the post', async () => {
      const { agent: authorAgent } = await signUpAndAuthenticate(app);
      const { agent: otherAgent } = await signUpAndAuthenticate(app);

      const createRes = await authorAgent.post('/posts').send(buildTestPost());
      const { id } = createRes.body;

      const putRes = await otherAgent
        .put(`/posts/${id}`)
        .send({ title: 'Hijacked title' });

      expect(putRes.status).toBe(404);
    });

    it("returns 404 when a different user attempts to change the post's status", async () => {
      const { agent: authorAgent } = await signUpAndAuthenticate(app);
      const { agent: otherAgent } = await signUpAndAuthenticate(app);

      const createRes = await authorAgent.post('/posts').send(buildTestPost());
      const { id } = createRes.body;

      const statusRes = await otherAgent.patch(`/posts/${id}/PUBLISHED`);
      expect(statusRes.status).toBe(404);
    });

    it('returns 404 when a different user attempts to delete the post', async () => {
      const { agent: authorAgent } = await signUpAndAuthenticate(app);
      const { agent: otherAgent } = await signUpAndAuthenticate(app);

      const createRes = await authorAgent.post('/posts').send(buildTestPost());
      const { id } = createRes.body;

      const deleteRes = await otherAgent.delete(`/posts/${id}`);

      expect(deleteRes.status).toBe(404);
    });
  });

  describe('delete', () => {
    it('removes the post so a subsequent GET returns 404', async () => {
      const { agent } = await signUpAndAuthenticate(app);

      const createRes = await agent.post('/posts').send(buildTestPost());
      const { id } = createRes.body;

      const deleteRes = await agent.delete(`/posts/${id}`);
      expect(deleteRes.status).toBe(204);

      const getRes = await agent.get(`/posts/${id}`);
      expect(getRes.status).toBe(404);
    });
  });

  describe('slug collisions', () => {
    it('suffixes the slug for a second post with the same title, both remain retrievable', async () => {
      const { agent } = await signUpAndAuthenticate(app);
      // Title kept literal and identical on purpose — this test verifies
      // the slug-suffixing transformation itself, not general creation.
      const title = 'Colliding Post Title';

      const firstRes = await agent
        .post('/posts')
        .send({ title, content: buildTestPost().content });
      const secondRes = await agent
        .post('/posts')
        .send({ title, content: buildTestPost().content });

      expect(firstRes.status).toBe(201);
      expect(secondRes.status).toBe(201);
      expect(firstRes.body.slug).not.toBe(secondRes.body.slug);

      const firstGet = await agent.get(`/posts/${firstRes.body.id}`);
      const secondGet = await agent.get(`/posts/${secondRes.body.id}`);
      expect(firstGet.status).toBe(200);
      expect(secondGet.status).toBe(200);
    });
  });

  describe('listing your own posts', () => {
    it('orders posts chronologically in both directions', async () => {
      const { agent } = await signUpAndAuthenticate(app);

      const first = await agent.post('/posts').send(buildTestPost());
      const second = await agent.post('/posts').send(buildTestPost());
      const third = await agent.post('/posts').send(buildTestPost());

      const descRes = await agent.get('/posts?order=desc');
      expect(descRes.body.map((post: { slug: string }) => post.slug)).toEqual([
        third.body.slug,
        second.body.slug,
        first.body.slug,
      ]);

      const ascRes = await agent.get('/posts?order=asc');
      expect(ascRes.body.map((post: { slug: string }) => post.slug)).toEqual([
        first.body.slug,
        second.body.slug,
        third.body.slug,
      ]);
    });

    it("only lists the requesting user's own posts", async () => {
      const { agent: agentA } = await signUpAndAuthenticate(app);
      const { agent: agentB } = await signUpAndAuthenticate(app);

      const postA = await agentA.post('/posts').send(buildTestPost());
      await agentB.post('/posts').send(buildTestPost());

      const res = await agentA.get('/posts');

      expect(res.body).toHaveLength(1);
      expect(res.body[0].slug).toBe(postA.body.slug);
    });
  });

  describe('publication status transitions', () => {
    it('rejects setting the status back to draft', async () => {
      const { agent } = await signUpAndAuthenticate(app);
      const createRes = await agent.post('/posts').send(buildTestPost());

      const res = await agent.patch(`/posts/${createRes.body.id}/DRAFT`);
      expect(res.status).toBe(400);
    });

    it('rejects an unrecognized status value', async () => {
      const { agent } = await signUpAndAuthenticate(app);
      const createRes = await agent.post('/posts').send(buildTestPost());

      const res = await agent.patch(`/posts/${createRes.body.id}/NOT_A_STATUS`);
      expect(res.status).toBe(400);
    });

    it('rejects unpublishing a post that was never published', async () => {
      const { agent } = await signUpAndAuthenticate(app);
      const createRes = await agent.post('/posts').send(buildTestPost());

      const res = await agent.patch(`/posts/${createRes.body.id}/UNPUBLISHED`);
      expect(res.status).toBe(400);
    });

    it('publishes a draft post', async () => {
      const { agent } = await signUpAndAuthenticate(app);
      const createRes = await agent.post('/posts').send(buildTestPost());

      const res = await agent.patch(`/posts/${createRes.body.id}/PUBLISHED`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('PUBLISHED');
    });

    it('allows unpublishing and republishing, since it is reversible', async () => {
      const { agent } = await signUpAndAuthenticate(app);
      const createRes = await agent.post('/posts').send(buildTestPost());
      const { id } = createRes.body;

      await agent.patch(`/posts/${id}/PUBLISHED`);
      const unpublishRes = await agent.patch(`/posts/${id}/UNPUBLISHED`);
      expect(unpublishRes.status).toBe(200);
      expect(unpublishRes.body.status).toBe('UNPUBLISHED');

      const republishRes = await agent.patch(`/posts/${id}/PUBLISHED`);
      expect(republishRes.status).toBe(200);
      expect(republishRes.body.status).toBe('PUBLISHED');
    });

    it('prevents further edits and status changes once a post is archived', async () => {
      const { agent } = await signUpAndAuthenticate(app);
      const createRes = await agent.post('/posts').send(buildTestPost());
      const { id } = createRes.body;

      const archiveRes = await agent.patch(`/posts/${id}/ARCHIVED`);
      expect(archiveRes.status).toBe(200);
      expect(archiveRes.body.status).toBe('ARCHIVED');

      const editRes = await agent
        .put(`/posts/${id}`)
        .send({ title: 'Should not apply' });
      expect(editRes.status).toBe(400);

      const statusRes = await agent.patch(`/posts/${id}/PUBLISHED`);
      expect(statusRes.status).toBe(400);
    });
  });

  describe('public listing and reads', () => {
    it('excludes draft posts', async () => {
      const { agent } = await signUpAndAuthenticate(app);
      const createRes = await agent.post('/posts').send(buildTestPost());
      const { slug } = createRes.body;

      const listRes = await request(app.getHttpServer()).get('/public/posts');
      expect(
        listRes.body.map((post: { slug: string }) => post.slug),
      ).not.toContain(slug);

      const getRes = await request(app.getHttpServer()).get(
        `/public/posts/${slug}`,
      );
      expect(getRes.status).toBe(404);
    });

    it('excludes unpublished and archived posts', async () => {
      const { agent } = await signUpAndAuthenticate(app);

      const unpublished = await agent.post('/posts').send(buildTestPost());
      await agent.patch(`/posts/${unpublished.body.id}/PUBLISHED`);
      await agent.patch(`/posts/${unpublished.body.id}/UNPUBLISHED`);

      const archived = await agent.post('/posts').send(buildTestPost());
      await agent.patch(`/posts/${archived.body.id}/ARCHIVED`);

      const listRes = await request(app.getHttpServer()).get('/public/posts');
      const slugs = listRes.body.map((post: { slug: string }) => post.slug);
      expect(slugs).not.toContain(unpublished.body.slug);
      expect(slugs).not.toContain(archived.body.slug);
    });

    it('includes a post once published, and both listing and get-by-slug reflect it', async () => {
      const { agent } = await signUpAndAuthenticate(app);
      const createRes = await agent.post('/posts').send(buildTestPost());
      const { id, slug, title } = createRes.body;

      await agent.patch(`/posts/${id}/PUBLISHED`);

      const listRes = await request(app.getHttpServer()).get('/public/posts');
      expect(listRes.body.map((post: { slug: string }) => post.slug)).toContain(
        slug,
      );

      const getRes = await request(app.getHttpServer()).get(
        `/public/posts/${slug}`,
      );
      expect(getRes.status).toBe(200);
      expect(getRes.body.title).toBe(title);
      expect(getRes.body.author).toMatchObject({ name: expect.any(String) });
    });

    it('orders published posts chronologically in both directions', async () => {
      const { agent } = await signUpAndAuthenticate(app);

      const first = await agent.post('/posts').send(buildTestPost());
      const second = await agent.post('/posts').send(buildTestPost());
      await agent.patch(`/posts/${first.body.id}/PUBLISHED`);
      await agent.patch(`/posts/${second.body.id}/PUBLISHED`);

      const descRes = await request(app.getHttpServer()).get(
        '/public/posts?order=desc',
      );
      expect(descRes.body.map((post: { slug: string }) => post.slug)).toEqual([
        second.body.slug,
        first.body.slug,
      ]);

      const ascRes = await request(app.getHttpServer()).get(
        '/public/posts?order=asc',
      );
      expect(ascRes.body.map((post: { slug: string }) => post.slug)).toEqual([
        first.body.slug,
        second.body.slug,
      ]);
    });

    it('filters by authorId', async () => {
      const { agent: agentA, user: userA } = await signUpAndAuthenticate(app);
      const { agent: agentB } = await signUpAndAuthenticate(app);

      const postA = await agentA.post('/posts').send(buildTestPost());
      await agentA.patch(`/posts/${postA.body.id}/PUBLISHED`);

      const postB = await agentB.post('/posts').send(buildTestPost());
      await agentB.patch(`/posts/${postB.body.id}/PUBLISHED`);

      const dbUserA = await prisma.user.findUnique({
        where: { email: userA.email },
      });

      const res = await request(app.getHttpServer()).get(
        `/public/posts?authorId=${dbUserA?.id}`,
      );

      expect(res.body).toHaveLength(1);
      expect(res.body[0].slug).toBe(postA.body.slug);
    });
  });
});
