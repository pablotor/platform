import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { Public } from 'test/mock-types';

import { buildControllerTestApp } from '../../test/controller-test-app';
import { PostsPublicController } from './posts.public.controller';
import { PublishedPostWithAuthor } from './posts.repository';
import { PostsService } from './posts.service';

// Full PostEntity shape (minus authorId being swapped for the requesting
// session's id where relevant) — ZodResponse validates whatever the
// (mocked) service returns against PostResponseSchema before it's
// serialized, so this needs every field the schema expects, not just the
// ones a given test cares about.
const fakePost = (
  overrides: Partial<PublishedPostWithAuthor> = {},
): PublishedPostWithAuthor => ({
  id: 'post-1',
  title: 'A post',
  slug: 'a-post',
  content: 'Some content',
  excerpt: null,
  kicker: null,
  category: null,
  seoTitle: null,
  seoDescription: null,
  isFeatured: false,
  status: 'PUBLISHED',
  publishedAt: new Date('11-04-1990'),
  createdAt: new Date('10-04-1990'),
  updatedAt: new Date('12-04-1990'),
  author: {
    id: 'bobby_id',
    name: 'bobby',
  },
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
      controller: PostsPublicController,
      providers: [{ provide: PostsService, useValue: postsService }],
      publicHandlers: ['findManyPublished', 'findBySlug'],
    });
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  describe('GET /public/posts', () => {
    it('returns 200 with only published posts and default ordering', async () => {
      postsService.findManyPublished.mockResolvedValue([fakePost()]);

      await testApp.request.get('/public/posts').expect(200);

      expect(postsService.findManyPublished).toHaveBeenCalledWith(
        expect.objectContaining({ order: 'desc' }),
      );
    });

    it('returns 200 and passes through order=asc', async () => {
      postsService.findManyPublished.mockResolvedValue([fakePost()]);

      await testApp.request.get('/public/posts?order=asc').expect(200);

      expect(postsService.findManyPublished).toHaveBeenCalledWith(
        expect.objectContaining({ order: 'asc' }),
      );
    });

    it('returns 400 on an invalid query param', async () => {
      await testApp.request.get('/public/posts?order=not-a-number').expect(400);
      expect(postsService.findManyPublished).not.toHaveBeenCalled();
    });
  });

  describe('GET /public/posts/:slug', () => {
    it('returns 200 when found', async () => {
      postsService.findPublishedBySlug.mockResolvedValue(fakePost());

      await testApp.request.get('/public/posts/a-post').expect(200);

      expect(postsService.findPublishedBySlug).toHaveBeenCalledWith('a-post');
    });

    it('returns 404 when not found', async () => {
      postsService.findPublishedBySlug.mockRejectedValue(
        new NotFoundException(),
      );

      await testApp.request.get('/public/posts/missing').expect(404);
    });
  });
});
