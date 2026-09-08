import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PostEntity } from '@repo/contracts';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { Public } from 'test/mock-types';

import { buildControllerTestApp } from '../../test/controller-test-app';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

const fakeSession = (userId: string): UserSession =>
  ({
    user: { id: userId, name: 'Test User', email: 'test@example.com' },
  }) as UserSession;

// Full PostEntity shape (minus authorId being swapped for the requesting
// session's id where relevant) — ZodResponse validates whatever the
// (mocked) service returns against PostResponseSchema before it's
// serialized, so this needs every field the schema expects, not just the
// ones a given test cares about.
const fakePost = (overrides: Partial<PostEntity> = {}): PostEntity => ({
  id: 'post_1',
  title: 'A post',
  slug: 'a-post',
  content: 'Some content',
  excerpt: null,
  kicker: null,
  authorId: 'user_1',
  category: null,
  seoTitle: null,
  seoDescription: null,
  isFeatured: false,
  status: 'DRAFT',
  publishedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('PostsController', () => {
  const postsService: jest.Mocked<Public<PostsService>> = {
    create: jest.fn(),
    update: jest.fn(),
    updatePublicationStatus: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findManyPublished: jest.fn(),
    find: jest.fn(),
    findPublishedBySlug: jest.fn(),
  };

  let testApp: Awaited<ReturnType<typeof buildControllerTestApp>>;

  beforeEach(async () => {
    jest.clearAllMocks();
    testApp = await buildControllerTestApp({
      controller: PostsController,
      providers: [{ provide: PostsService, useValue: postsService }],
    });
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  describe('POST /posts', () => {
    const validPayload = { title: 'My post', content: 'Some content' };

    it('returns 201 on a valid payload when authenticated', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.create.mockResolvedValue(fakePost());

      await testApp.request.post('/posts').send(validPayload).expect(201);

      expect(postsService.create).toHaveBeenCalledWith(
        { ...validPayload },
        'user_1',
      );
    });

    it('returns 401 when unauthenticated', async () => {
      testApp.setSession(null);

      await testApp.request.post('/posts').send(validPayload).expect(401);
      expect(postsService.create).not.toHaveBeenCalled();
    });

    it('returns 400 when title is missing', async () => {
      testApp.setSession(fakeSession('user_1'));

      await testApp.request
        .post('/posts')
        .send({ content: 'Some content' })
        .expect(400);
      expect(postsService.create).not.toHaveBeenCalled();
    });

    it('returns 400 when title exceeds the max length', async () => {
      testApp.setSession(fakeSession('user_1'));

      await testApp.request
        .post('/posts')
        .send({ title: 'x'.repeat(201), content: 'Some content' })
        .expect(400);
    });

    it('returns 400 when the title has 5 or fewer letters/numbers once normalized', async () => {
      // Punctuation-only titles still pass the plain min-length(5) check
      // but fail the refine that strips diacritics/non-alphanumerics and
      // requires more than 5 characters left over.
      testApp.setSession(fakeSession('user_1'));

      await testApp.request
        .post('/posts')
        .send({ title: '!!!!!!', content: 'Some content' })
        .expect(400);
    });

    it('returns 400 when content is empty', async () => {
      testApp.setSession(fakeSession('user_1'));

      await testApp.request
        .post('/posts')
        .send({ title: 'My post', content: '' })
        .expect(400);
    });

    it('returns 400 when an explicit slug is not lowercase and hyphen-separated', async () => {
      testApp.setSession(fakeSession('user_1'));

      await testApp.request
        .post('/posts')
        .send({ ...validPayload, slug: 'Not A Valid Slug' })
        .expect(400);
      expect(postsService.create).not.toHaveBeenCalled();
    });
  });

  describe('PUT /posts/:id', () => {
    it('returns 200 for the author with a valid payload', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.update.mockResolvedValue(fakePost({ title: 'Updated' }));

      await testApp.request
        .put('/posts/post_1')
        .send({ title: 'Updated' })
        .expect(200);

      expect(postsService.update).toHaveBeenCalledWith(
        'post_1',
        { title: 'Updated' },
        'user_1',
      );
    });

    it('returns 401 when unauthenticated', async () => {
      testApp.setSession(null);

      await testApp.request
        .put('/posts/post_1')
        .send({ title: 'Updated' })
        .expect(401);
    });

    it('returns 404 when the requester is not the author', async () => {
      // The service no longer distinguishes "not found" from "found but
      // not yours" — both come back as NotFoundException from a repository
      // lookup scoped to the requester, so editing someone else's post 404s
      // rather than 403s.
      testApp.setSession(fakeSession('user_2'));
      postsService.update.mockRejectedValue(new NotFoundException());

      await testApp.request
        .put('/posts/post_1')
        .send({ title: 'Updated' })
        .expect(404);
    });

    it('returns 404 when the post does not exist', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.update.mockRejectedValue(new NotFoundException());

      await testApp.request
        .put('/posts/missing')
        .send({ title: 'Updated' })
        .expect(404);
    });

    it('returns 400 when the post is archived', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.update.mockRejectedValue(
        new BadRequestException('An archived post cannot be modified'),
      );

      await testApp.request
        .put('/posts/post_1')
        .send({ title: 'Updated' })
        .expect(400);
    });

    it('returns 400 on an invalid payload', async () => {
      testApp.setSession(fakeSession('user_1'));

      await testApp.request
        .put('/posts/post_1')
        .send({ title: 'x'.repeat(201) })
        .expect(400);
    });
  });

  describe('PATCH /posts/:id/:status', () => {
    it('returns 200 for a valid status transition', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.updatePublicationStatus.mockResolvedValue(
        fakePost({ status: 'PUBLISHED' }),
      );

      await testApp.request.patch('/posts/post_1/PUBLISHED').expect(200);

      expect(postsService.updatePublicationStatus).toHaveBeenCalledWith(
        'post_1',
        'PUBLISHED',
        'user_1',
      );
    });

    it('returns 401 when unauthenticated', async () => {
      testApp.setSession(null);

      await testApp.request.patch('/posts/post_1/PUBLISHED').expect(401);
      expect(postsService.updatePublicationStatus).not.toHaveBeenCalled();
    });

    it('returns 404 when the post does not exist or is not owned by the requester', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.updatePublicationStatus.mockRejectedValue(
        new NotFoundException(),
      );

      await testApp.request.patch('/posts/missing/PUBLISHED').expect(404);
    });

    it('returns 400 when the service rejects an invalid transition', async () => {
      // Covers the service's various BadRequestException cases (target is
      // DRAFT, already in that status, archived, or draft->unpublished) —
      // those distinctions are exercised in the service's own tests; the
      // controller only needs to prove it maps the exception to a 400.
      testApp.setSession(fakeSession('user_1'));
      postsService.updatePublicationStatus.mockRejectedValue(
        new BadRequestException('Post is already PUBLISHED.'),
      );

      await testApp.request.patch('/posts/post_1/PUBLISHED').expect(400);
    });

    it('returns 400 when the status param is not a recognized status value', async () => {
      // `:id/:status` is validated as a whole via a Zod-backed params DTO,
      // so a bogus status is rejected before the handler (and therefore
      // the service) ever runs.
      testApp.setSession(fakeSession('user_1'));

      await testApp.request.patch('/posts/post_1/NOT_A_STATUS').expect(400);
      expect(postsService.updatePublicationStatus).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /posts/:id', () => {
    it('returns 204 for the author', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.delete.mockResolvedValue(undefined);

      await testApp.request.delete('/posts/post_1').expect(204);
      expect(postsService.delete).toHaveBeenCalledWith('post_1', 'user_1');
    });

    it('returns 401 when unauthenticated', async () => {
      testApp.setSession(null);

      await testApp.request.delete('/posts/post_1').expect(401);
    });

    it('returns 404 when the requester is not the author', async () => {
      // Same 404-not-403 behavior as PUT: delete is forwarded straight to
      // the repository scoped by (id, requesterId), so a non-owner sees a
      // plain not-found rather than learning the post exists.
      testApp.setSession(fakeSession('user_2'));
      postsService.delete.mockRejectedValue(new NotFoundException());

      await testApp.request.delete('/posts/post_1').expect(404);
    });

    it('returns 404 when the post does not exist', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.delete.mockRejectedValue(new NotFoundException());

      await testApp.request.delete('/posts/missing').expect(404);
    });
  });

  describe('GET /posts', () => {
    it('returns 200 with default ordering, scoped to the session user', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.findMany.mockResolvedValue([fakePost()]);

      await testApp.request.get('/posts').expect(200);

      expect(postsService.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ order: 'desc' }),
        'user_1',
      );
    });

    it('returns 200 and passes through order=asc', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.findMany.mockResolvedValue([]);

      await testApp.request.get('/posts?order=asc').expect(200);

      expect(postsService.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ order: 'asc' }),
        'user_1',
      );
    });

    it('returns 400 on an invalid query param', async () => {
      testApp.setSession(fakeSession('user_1'));

      await testApp.request.get('/posts?order=not-a-number').expect(400);
      expect(postsService.findMany).not.toHaveBeenCalled();
    });

    it('returns 401 when unauthenticated', async () => {
      testApp.setSession(null);

      await testApp.request.get('/posts').expect(401);
      expect(postsService.findMany).not.toHaveBeenCalled();
    });
  });

  describe('GET /posts/:id', () => {
    it('returns 200 when found and owned by the requester', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.find.mockResolvedValue(fakePost());

      await testApp.request.get('/posts/post_1').expect(200);

      expect(postsService.find).toHaveBeenCalledWith('post_1', 'user_1');
    });

    it('returns 404 when not found', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.find.mockRejectedValue(new NotFoundException());

      await testApp.request.get('/posts/missing').expect(404);
    });

    it("returns 404 for another user's post", async () => {
      // Same reasoning as PUT/DELETE — repository.find is scoped by
      // (id, requesterId), so a post that exists but isn't owned by the
      // requester is indistinguishable from a missing one at this layer.
      testApp.setSession(fakeSession('user_2'));
      postsService.find.mockRejectedValue(new NotFoundException());

      await testApp.request.get('/posts/post_1').expect(404);
    });

    it('returns 401 when unauthenticated', async () => {
      testApp.setSession(null);

      await testApp.request.get('/posts/post_1').expect(401);
      expect(postsService.find).not.toHaveBeenCalled();
    });
  });
});
