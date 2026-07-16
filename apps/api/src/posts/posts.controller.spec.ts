import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { Public } from 'test/mock-types';

import { buildControllerTestApp } from '../../test/controller-test-app';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

const fakeSession = (userId: string): UserSession =>
  ({
    user: { id: userId, name: 'Test User', email: 'test@example.com' },
  }) as UserSession;

const fakePost = (overrides: Record<string, unknown> = {}) => ({
  id: 'post_1',
  title: 'A post',
  slug: 'a-post',
  content: 'Some content',
  createdAt: new Date(),
  updatedAt: new Date(),
  author: { id: 'user_1', name: 'Test User' },
  ...overrides,
});

describe('PostsController', () => {
  const postsService: jest.Mocked<Public<PostsService>> = {
    create: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findBySlug: jest.fn(),
  };

  let testApp: Awaited<ReturnType<typeof buildControllerTestApp>>;

  beforeEach(async () => {
    jest.clearAllMocks();
    testApp = await buildControllerTestApp({
      controller: PostsController,
      providers: [{ provide: PostsService, useValue: postsService }],
      publicHandlers: ['findMany', 'findBySlug'],
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

      expect(postsService.create).toHaveBeenCalledWith(validPayload, 'user_1');
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

    it('returns 400 when content is empty', async () => {
      testApp.setSession(fakeSession('user_1'));

      await testApp.request
        .post('/posts')
        .send({ title: 'My post', content: '' })
        .expect(400);
    });
  });

  describe('PATCH /posts/:slug', () => {
    it('returns 200 for the author with a valid partial payload', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.patch.mockResolvedValue(fakePost({ title: 'Updated' }));

      await testApp.request
        .patch('/posts/a-post')
        .send({ title: 'Updated' })
        .expect(200);

      expect(postsService.patch).toHaveBeenCalledWith(
        'a-post',
        { title: 'Updated' },
        'user_1',
      );
    });

    it('returns 401 when unauthenticated', async () => {
      testApp.setSession(null);

      await testApp.request
        .patch('/posts/a-post')
        .send({ title: 'Updated' })
        .expect(401);
    });

    it('returns 403 when the requester is not the author', async () => {
      testApp.setSession(fakeSession('user_2'));
      postsService.patch.mockRejectedValue(new ForbiddenException());

      await testApp.request
        .patch('/posts/a-post')
        .send({ title: 'Updated' })
        .expect(403);
    });

    it('returns 404 when the post does not exist', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.patch.mockRejectedValue(new NotFoundException());

      await testApp.request
        .patch('/posts/missing')
        .send({ title: 'Updated' })
        .expect(404);
    });

    it('returns 400 on an invalid payload', async () => {
      testApp.setSession(fakeSession('user_1'));

      await testApp.request
        .patch('/posts/a-post')
        .send({ title: 'x'.repeat(201) })
        .expect(400);
    });
  });

  describe('DELETE /posts/:slug', () => {
    it('returns 204 for the author', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.delete.mockResolvedValue(undefined);

      await testApp.request.delete('/posts/a-post').expect(204);
      expect(postsService.delete).toHaveBeenCalledWith('a-post', 'user_1');
    });

    it('returns 401 when unauthenticated', async () => {
      testApp.setSession(null);

      await testApp.request.delete('/posts/a-post').expect(401);
    });

    it('returns 403 when the requester is not the author', async () => {
      testApp.setSession(fakeSession('user_2'));
      postsService.delete.mockRejectedValue(new ForbiddenException());

      await testApp.request.delete('/posts/a-post').expect(403);
    });

    it('returns 404 when the post does not exist', async () => {
      testApp.setSession(fakeSession('user_1'));
      postsService.delete.mockRejectedValue(new NotFoundException());

      await testApp.request.delete('/posts/missing').expect(404);
    });
  });

  describe('GET /posts', () => {
    it('returns 200 with default ordering when no query params are given', async () => {
      postsService.findMany.mockResolvedValue([fakePost()]);

      await testApp.request.get('/posts').expect(200);

      expect(postsService.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ order: 'desc', page: 1, limit: 20 }),
      );
    });

    it('returns 200 and passes through order=asc', async () => {
      postsService.findMany.mockResolvedValue([]);

      await testApp.request.get('/posts?order=asc').expect(200);

      expect(postsService.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ order: 'asc' }),
      );
    });

    it('returns 200 and passes through the authorId filter', async () => {
      postsService.findMany.mockResolvedValue([]);

      await testApp.request.get('/posts?authorId=user_1').expect(200);

      expect(postsService.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ authorId: 'user_1' }),
      );
    });

    it('returns 400 on an invalid query param', async () => {
      await testApp.request.get('/posts?page=not-a-number').expect(400);
      expect(postsService.findMany).not.toHaveBeenCalled();
    });

    it('does not require authentication', async () => {
      testApp.setSession(null);
      postsService.findMany.mockResolvedValue([]);

      await testApp.request.get('/posts').expect(200);
    });
  });

  describe('GET /posts/:slug', () => {
    it('returns 200 when found', async () => {
      postsService.findBySlug.mockResolvedValue(fakePost());

      await testApp.request.get('/posts/a-post').expect(200);
    });

    it('returns 404 when not found', async () => {
      postsService.findBySlug.mockRejectedValue(new NotFoundException());

      await testApp.request.get('/posts/missing').expect(404);
    });

    it('does not require authentication', async () => {
      testApp.setSession(null);
      postsService.findBySlug.mockResolvedValue(fakePost());

      await testApp.request.get('/posts/a-post').expect(200);
    });
  });
});
