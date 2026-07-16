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

    it('does not require authentication to list or read posts', async () => {
      const res = await request(app.getHttpServer()).get('/posts');
      expect(res.status).toBe(200);
    });
  });

  describe('create → edit → get-by-slug round trip', () => {
    it('lets the author create, patch, and then fetch the post by slug', async () => {
      const { agent } = await signUpAndAuthenticate(app);
      const post = buildTestPost();

      const createRes = await agent.post('/posts').send(post);
      expect(createRes.status).toBe(201);
      const { slug } = createRes.body;

      const patchRes = await agent
        .patch(`/posts/${slug}`)
        .send({ title: 'Updated title' });
      expect(patchRes.status).toBe(200);
      expect(patchRes.body.title).toBe('Updated title');

      // Fetching by the ORIGINAL slug after a title-changing patch also
      // proves slug immutability as a side effect — if the slug had
      // regenerated to match the new title, this would 404.
      const getRes = await request(app.getHttpServer()).get(`/posts/${slug}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.title).toBe('Updated title');
      expect(getRes.body.slug).toBe(slug);
    });
  });

  describe('ownership', () => {
    it('returns 403 when a different user attempts to edit the post', async () => {
      const { agent: authorAgent } = await signUpAndAuthenticate(app);
      const { agent: otherAgent } = await signUpAndAuthenticate(app);

      const createRes = await authorAgent.post('/posts').send(buildTestPost());
      const { slug } = createRes.body;

      const patchRes = await otherAgent
        .patch(`/posts/${slug}`)
        .send({ title: 'Hijacked title' });

      expect(patchRes.status).toBe(403);
    });

    it('returns 403 when a different user attempts to delete the post', async () => {
      const { agent: authorAgent } = await signUpAndAuthenticate(app);
      const { agent: otherAgent } = await signUpAndAuthenticate(app);

      const createRes = await authorAgent.post('/posts').send(buildTestPost());
      const { slug } = createRes.body;

      const deleteRes = await otherAgent.delete(`/posts/${slug}`);

      expect(deleteRes.status).toBe(403);
    });
  });

  describe('delete', () => {
    it('removes the post so a subsequent GET returns 404', async () => {
      const { agent } = await signUpAndAuthenticate(app);

      const createRes = await agent.post('/posts').send(buildTestPost());
      const { slug } = createRes.body;

      const deleteRes = await agent.delete(`/posts/${slug}`);
      expect(deleteRes.status).toBe(204);

      const getRes = await request(app.getHttpServer()).get(`/posts/${slug}`);
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

      const firstGet = await request(app.getHttpServer()).get(
        `/posts/${firstRes.body.slug}`,
      );
      const secondGet = await request(app.getHttpServer()).get(
        `/posts/${secondRes.body.slug}`,
      );
      expect(firstGet.status).toBe(200);
      expect(secondGet.status).toBe(200);
    });
  });

  describe('listing', () => {
    it('orders posts chronologically in both directions', async () => {
      const { agent } = await signUpAndAuthenticate(app);

      const first = await agent.post('/posts').send(buildTestPost());
      const second = await agent.post('/posts').send(buildTestPost());
      const third = await agent.post('/posts').send(buildTestPost());

      const descRes = await request(app.getHttpServer()).get(
        '/posts?order=desc',
      );
      expect(descRes.body.map((post: { slug: string }) => post.slug)).toEqual([
        third.body.slug,
        second.body.slug,
        first.body.slug,
      ]);

      const ascRes = await request(app.getHttpServer()).get('/posts?order=asc');
      expect(ascRes.body.map((post: { slug: string }) => post.slug)).toEqual([
        first.body.slug,
        second.body.slug,
        third.body.slug,
      ]);
    });

    it('filters by authorId', async () => {
      const { agent: agentA, user: userA } = await signUpAndAuthenticate(app);
      const { agent: agentB } = await signUpAndAuthenticate(app);

      const postA = await agentA.post('/posts').send(buildTestPost());
      await agentB.post('/posts').send(buildTestPost());

      const dbUserA = await prisma.user.findUnique({
        where: { email: userA.email },
      });

      const res = await request(app.getHttpServer()).get(
        `/posts?authorId=${dbUserA?.id}`,
      );

      expect(res.body).toHaveLength(1);
      expect(res.body[0].slug).toBe(postA.body.slug);
    });
  });
});
