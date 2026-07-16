import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { randFullName, randParagraph, randUuid } from '@ngneat/falso';

import type { Public } from '../../test/mock-types';
import { PostsRepository, PostWithAuthor } from './posts.repository';
import { PostsService } from './posts.service';

// title/slug are NOT randomized here — the `create` tests below assert the
// exact title → slug transformation, so a literal value keeps those
// assertions meaningful instead of needing to recompute the expected slug
// via the same function the service uses. Everything else is opaque to
// these tests, so falso gives realistic variation for free — same reasoning
// as buildTestUser in the e2e auth helpers.
const fakePost = (overrides: Partial<PostWithAuthor> = {}): PostWithAuthor => ({
  id: randUuid(),
  title: 'My First Post',
  slug: 'my-first-post',
  content: randParagraph(),
  createdAt: new Date(),
  updatedAt: new Date(),
  author: { id: randUuid(), name: randFullName() },
  ...overrides,
});

describe('PostsService', () => {
  const postsRepository: jest.Mocked<Public<PostsRepository>> = {
    create: jest.fn(),
    findBySlug: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  let service: PostsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PostsService(postsRepository as unknown as PostsRepository); //FIXME the Public type should avoid this
  });

  describe('create', () => {
    it('generates a slug from the title when no collision exists', async () => {
      const content = randParagraph();
      const authorId = randUuid();
      postsRepository.findBySlug.mockResolvedValue(null);
      postsRepository.create.mockResolvedValue(fakePost());

      await service.create({ title: 'My First Post', content }, authorId);

      expect(postsRepository.create).toHaveBeenCalledWith({
        title: 'My First Post',
        content,
        slug: 'my-first-post',
        authorId,
      });
    });

    it('retries with a numeric suffix when the base slug is taken', async () => {
      const authorId = randUuid();
      postsRepository.findBySlug
        .mockResolvedValueOnce(fakePost({ slug: 'my-first-post' })) // base slug taken
        .mockResolvedValueOnce(null); // suffixed slug available
      postsRepository.create.mockResolvedValue(
        fakePost({ slug: 'my-first-post-2' }),
      );

      await service.create(
        { title: 'My First Post', content: randParagraph() },
        authorId,
      );

      expect(postsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: 'my-first-post-2' }),
      );
    });

    it('gives up and throws ConflictException if no slug variant is ever available', async () => {
      // Every attempt comes back taken — this is the deliberate escape
      // hatch so a pathological/adversarial title can't hang the request
      // in an infinite retry loop.
      postsRepository.findBySlug.mockResolvedValue(fakePost());

      await expect(
        service.create(
          { title: 'My First Post', content: randParagraph() },
          randUuid(),
        ),
      ).rejects.toThrow(ConflictException);
      expect(postsRepository.create).not.toHaveBeenCalled();
    });

    it('returns the created post as-is from the repository', async () => {
      postsRepository.findBySlug.mockResolvedValue(null);
      const created = fakePost();
      postsRepository.create.mockResolvedValue(created);

      const result = await service.create(
        { title: 'My First Post', content: randParagraph() },
        randUuid(),
      );

      expect(result).toBe(created);
    });
  });

  describe('patch', () => {
    it('updates the post when the requester is the author', async () => {
      const authorId = randUuid();
      const existing = fakePost({
        author: { id: authorId, name: randFullName() },
      });
      postsRepository.findBySlug.mockResolvedValue(existing);
      postsRepository.update.mockResolvedValue(fakePost({ title: 'Updated' }));

      await service.patch(existing.slug, { title: 'Updated' }, authorId);

      expect(postsRepository.update).toHaveBeenCalledWith(existing.id, {
        title: 'Updated',
      });
    });

    it('throws ForbiddenException when the requester is not the author, without calling update', async () => {
      const existing = fakePost({
        author: { id: randUuid(), name: randFullName() },
      });
      postsRepository.findBySlug.mockResolvedValue(existing);

      await expect(
        service.patch(existing.slug, { title: 'Updated' }, randUuid()),
      ).rejects.toThrow(ForbiddenException);
      expect(postsRepository.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when the post does not exist, without calling update', async () => {
      postsRepository.findBySlug.mockResolvedValue(null);

      await expect(
        service.patch('missing', { title: 'Updated' }, randUuid()),
      ).rejects.toThrow(NotFoundException);
      expect(postsRepository.update).not.toHaveBeenCalled();
    });

    it('never forwards a slug field to the repository, even if present on the payload', async () => {
      const authorId = randUuid();
      const existing = fakePost({
        author: { id: authorId, name: randFullName() },
      });
      postsRepository.findBySlug.mockResolvedValue(existing);
      postsRepository.update.mockResolvedValue(existing);

      // Bypasses the contract's own type safety on purpose — this guards
      // against a future contract change accidentally allowing `slug`
      // through, not against what the contract currently permits.
      const payloadWithSlug = {
        title: 'Updated',
        slug: 'malicious-slug',
      } as unknown as Parameters<typeof service.patch>[1];

      await service.patch(existing.slug, payloadWithSlug, authorId);

      expect(postsRepository.update).toHaveBeenCalledWith(
        existing.id,
        expect.not.objectContaining({ slug: expect.anything() }),
      );
    });
  });

  describe('delete', () => {
    it('deletes the post when the requester is the author', async () => {
      const authorId = randUuid();
      const existing = fakePost({
        author: { id: authorId, name: randFullName() },
      });
      postsRepository.findBySlug.mockResolvedValue(existing);
      postsRepository.delete.mockResolvedValue(undefined);

      await service.delete(existing.slug, authorId);

      expect(postsRepository.delete).toHaveBeenCalledWith(existing.id);
    });

    it('throws ForbiddenException when the requester is not the author, without calling delete', async () => {
      const existing = fakePost({
        author: { id: randUuid(), name: randFullName() },
      });
      postsRepository.findBySlug.mockResolvedValue(existing);

      await expect(service.delete(existing.slug, randUuid())).rejects.toThrow(
        ForbiddenException,
      );
      expect(postsRepository.delete).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when the post does not exist, without calling delete', async () => {
      postsRepository.findBySlug.mockResolvedValue(null);

      await expect(service.delete('missing', randUuid())).rejects.toThrow(
        NotFoundException,
      );
      expect(postsRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('findMany', () => {
    it('passes the query straight through to the repository', async () => {
      const query = { order: 'desc' as const, page: 1, limit: 20 };
      postsRepository.findMany.mockResolvedValue([fakePost()]);

      await service.findMany(query);

      expect(postsRepository.findMany).toHaveBeenCalledWith(query);
    });
  });

  describe('findBySlug', () => {
    it('returns the post when found', async () => {
      const existing = fakePost();
      postsRepository.findBySlug.mockResolvedValue(existing);

      const result = await service.findBySlug('my-first-post');

      expect(result).toBe(existing);
    });

    it('throws NotFoundException when not found', async () => {
      postsRepository.findBySlug.mockResolvedValue(null);

      await expect(service.findBySlug('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
