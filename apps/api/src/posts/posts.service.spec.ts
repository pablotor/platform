import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { randFullName, randParagraph, randUuid } from '@ngneat/falso';
import type { CreatePost, PostEntity, PostStatus } from '@repo/contracts';

import { PostQuery } from '../../../../packages/contracts/dist/posts/posts.contracts';
import type { Public } from '../../test/mock-types';
import { PostsRepository, PublishedPostWithAuthor } from './posts.repository';
import { PostsService } from './posts.service';
import { buildSlug } from './posts.slug';

// title/slug are NOT randomized here — several tests assert the exact
// title -> slug transformation and retry suffixing, so literal values keep
// those assertions meaningful. Everything else is opaque to these tests, so
// falso gives realistic variation for free. Nullish metadata fields default
// to null (their normal "unset" value) unless a test overrides them.
const fakePost = (overrides: Partial<PostEntity> = {}): PostEntity => ({
  id: randUuid(),
  title: 'My First Post',
  slug: 'my-first-post',
  content: randParagraph(),
  excerpt: null,
  kicker: null,
  authorId: randUuid(),
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

const fakePublishedPost = (
  overrides: Partial<PublishedPostWithAuthor> = {},
): PublishedPostWithAuthor => ({
  id: randUuid(),
  title: 'My First Post',
  slug: 'my-first-post',
  content: randParagraph(),
  excerpt: null,
  kicker: null,
  category: null,
  seoTitle: null,
  seoDescription: null,
  isFeatured: false,
  status: 'PUBLISHED',
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  author: { id: randUuid(), name: randFullName() },
  ...overrides,
});

describe('PostsService', () => {
  const postsRepository: jest.Mocked<Public<PostsRepository>> = {
    create: jest.fn(),
    findBySlug: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findManyPublished: jest.fn(),
    findPublishedBySlug: jest.fn(),
  };

  let service: PostsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PostsService(postsRepository as unknown as PostsRepository); //FIXME the Public type should avoid this
  });

  describe('create', () => {
    it('generates a slug from the title via buildSlug when no slug is provided', async () => {
      // `slug` is optional on CreatePost, so "no slug provided" means the
      // key is simply absent — that's what `data.slug || buildSlug(data.title)`
      // falls back on. buildSlug is a pure function, so we just call the
      // real thing rather than mocking it.
      const authorId = randUuid();
      const data: CreatePost = {
        title: 'My First Post',
        content: randParagraph(),
        isFeatured: false,
      };
      postsRepository.findBySlug.mockResolvedValue(null);
      postsRepository.create.mockResolvedValue(fakePost());

      await service.create(data, authorId);

      expect(postsRepository.create).toHaveBeenCalledWith({
        ...data,
        slug: buildSlug('My First Post'),
        authorId,
      });
    });

    it('uses an explicitly provided slug as-is, instead of one generated from the title', async () => {
      const authorId = randUuid();
      const data: CreatePost = {
        title: 'My First Post',
        content: randParagraph(),
        slug: 'custom-slug',
        isFeatured: false,
      };
      postsRepository.findBySlug.mockResolvedValue(null);
      postsRepository.create.mockResolvedValue(
        fakePost({ slug: 'custom-slug' }),
      );

      await service.create(data, authorId);

      // buildSlug('My First Post') would produce 'my-first-post', so
      // asserting the repository was queried and created with the
      // explicit 'custom-slug' is evidence the title-derived slug was
      // never used.
      expect(postsRepository.findBySlug).toHaveBeenCalledWith('custom-slug');
      expect(postsRepository.create).toHaveBeenCalledWith({
        ...data,
        slug: 'custom-slug',
        authorId,
      });
    });

    it('retries with an incrementing numeric suffix when the base slug is taken', async () => {
      const authorId = randUuid();
      const baseSlug = buildSlug('My First Post');
      postsRepository.findBySlug
        .mockResolvedValueOnce(fakePost({ slug: baseSlug })) // base slug taken
        .mockResolvedValueOnce(null); // first retry available
      postsRepository.create.mockResolvedValue(
        fakePost({ slug: `${baseSlug}-2` }),
      );

      await service.create(
        { title: 'My First Post', content: randParagraph(), isFeatured: false },
        authorId,
      );

      expect(postsRepository.findBySlug).toHaveBeenNthCalledWith(1, baseSlug);
      expect(postsRepository.findBySlug).toHaveBeenNthCalledWith(
        2,
        `${baseSlug}-2`,
      );
      expect(postsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: `${baseSlug}-2` }),
      );
    });

    it('gives up after MAX_SLUG_ATTEMPTS and throws ConflictException without calling create', async () => {
      // Every attempt comes back taken — this is the deliberate escape
      // hatch so a pathological/adversarial title can't hang the request
      // in an infinite retry loop.
      postsRepository.findBySlug.mockResolvedValue(fakePost());

      await expect(
        service.create(
          {
            title: 'My First Post',
            content: randParagraph(),
            isFeatured: false,
          },
          randUuid(),
        ),
      ).rejects.toThrow(ConflictException);
      expect(postsRepository.create).not.toHaveBeenCalled();
      expect(postsRepository.findBySlug).toHaveBeenCalledTimes(20);
    });

    it('returns the created post as-is from the repository', async () => {
      postsRepository.findBySlug.mockResolvedValue(null);
      const created = fakePost();
      postsRepository.create.mockResolvedValue(created);

      const result = await service.create(
        { title: 'My First Post', content: randParagraph(), isFeatured: false },
        randUuid(),
      );

      expect(result).toBe(created);
    });
  });

  describe('update', () => {
    it('updates the post when repository.find resolves it for the requester', async () => {
      const authorId = randUuid();
      const existing = fakePost({ authorId, status: 'DRAFT' as PostStatus });
      postsRepository.find.mockResolvedValue(existing);
      postsRepository.update.mockResolvedValue(fakePost({ title: 'Updated' }));

      await service.update(existing.id, { title: 'Updated' }, authorId);

      expect(postsRepository.find).toHaveBeenCalledWith(existing.id, authorId);
      expect(postsRepository.update).toHaveBeenCalledWith(
        existing.id,
        { title: 'Updated' },
        authorId,
      );
    });

    it('throws NotFoundException without calling update when repository.find resolves null', async () => {
      // repository.find is scoped by (id, requesterId), so this covers both
      // "post doesn't exist" and "post exists but isn't owned by the
      // requester" — the service can't distinguish the two, and doesn't
      // need to since the repository already applied the scoping.
      postsRepository.find.mockResolvedValue(null);

      await expect(
        service.update('missing', { title: 'Updated' }, randUuid()),
      ).rejects.toThrow(NotFoundException);
      expect(postsRepository.update).not.toHaveBeenCalled();
    });

    it('throws BadRequestException without calling update when the post is archived', async () => {
      const authorId = randUuid();
      const existing = fakePost({
        authorId,
        status: 'ARCHIVED' as PostStatus,
      });
      postsRepository.find.mockResolvedValue(existing);

      await expect(
        service.update(existing.id, { title: 'Updated' }, authorId),
      ).rejects.toThrow('An archived post cannot be modified');
      expect(postsRepository.update).not.toHaveBeenCalled();
    });

    it('returns the updated post as-is from the repository', async () => {
      const authorId = randUuid();
      const existing = fakePost({ authorId, status: 'DRAFT' as PostStatus });
      postsRepository.find.mockResolvedValue(existing);
      const updated = fakePost({ authorId, title: 'Updated' });
      postsRepository.update.mockResolvedValue(updated);

      const result = await service.update(
        existing.id,
        { title: 'Updated' },
        authorId,
      );

      expect(result).toBe(updated);
    });
  });

  describe('updatePublicationStatus', () => {
    // Status literals are cast to PostStatus so this test doesn't need to
    // import/assert against the full enum — update these if the status
    // values change.
    const DRAFT = 'DRAFT' as PostStatus;
    const PUBLISHED = 'PUBLISHED' as PostStatus;
    const UNPUBLISHED = 'UNPUBLISHED' as PostStatus;
    const ARCHIVED = 'ARCHIVED' as PostStatus;

    it('throws BadRequestException immediately when the target status is DRAFT, without touching the repository', async () => {
      // A post can never be moved back to DRAFT through this endpoint.
      await expect(
        service.updatePublicationStatus(randUuid(), DRAFT, randUuid()),
      ).rejects.toThrow(
        'A post publication status cannot be changed to draft.',
      );
      expect(postsRepository.find).not.toHaveBeenCalled();
      expect(postsRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when repository.find resolves null, without calling updateStatus', async () => {
      // Same scoped-lookup reasoning as update()/find(): covers both
      // "doesn't exist" and "exists but isn't owned by the requester".
      postsRepository.find.mockResolvedValue(null);

      await expect(
        service.updatePublicationStatus('missing', PUBLISHED, randUuid()),
      ).rejects.toThrow(NotFoundException);
      expect(postsRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('throws BadRequestException without calling updateStatus when the post is archived', async () => {
      // Archived posts are immutable — checked before the "already this
      // status" / draft-transition checks, so it wins even when the
      // requested status also happens to differ from ARCHIVED.
      const requesterId = randUuid();
      const existing = fakePost({ authorId: requesterId, status: ARCHIVED });
      postsRepository.find.mockResolvedValue(existing);

      await expect(
        service.updatePublicationStatus(existing.id, PUBLISHED, requesterId),
      ).rejects.toThrow('An archived post cannot be modified');
      expect(postsRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when the post is already in the requested status', async () => {
      const requesterId = randUuid();
      const existing = fakePost({ authorId: requesterId, status: PUBLISHED });
      postsRepository.find.mockResolvedValue(existing);

      await expect(
        service.updatePublicationStatus(existing.id, PUBLISHED, requesterId),
      ).rejects.toThrow('Post is already PUBLISHED.');
      expect(postsRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when trying to unpublish a post that was never published', async () => {
      const requesterId = randUuid();
      const existing = fakePost({ authorId: requesterId, status: DRAFT });
      postsRepository.find.mockResolvedValue(existing);

      await expect(
        service.updatePublicationStatus(existing.id, UNPUBLISHED, requesterId),
      ).rejects.toThrow('A draft post can only be published or archived.');
      expect(postsRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('updates the status via the repository for a valid transition', async () => {
      const requesterId = randUuid();
      const existing = fakePost({ authorId: requesterId, status: DRAFT });
      const updated = fakePost({ authorId: requesterId, status: PUBLISHED });
      postsRepository.find.mockResolvedValue(existing);
      postsRepository.updateStatus.mockResolvedValue(updated);

      const result = await service.updatePublicationStatus(
        existing.id,
        PUBLISHED,
        requesterId,
      );

      expect(postsRepository.find).toHaveBeenCalledWith(
        existing.id,
        requesterId,
      );
      expect(postsRepository.updateStatus).toHaveBeenCalledWith(
        existing.id,
        { status: PUBLISHED, publishedAt: expect.any(Date) },
        requesterId,
      );
      expect(result).toBe(updated);
    });

    it('allows archiving a draft post directly', async () => {
      const requesterId = randUuid();
      const existing = fakePost({ authorId: requesterId, status: DRAFT });
      postsRepository.find.mockResolvedValue(existing);
      postsRepository.updateStatus.mockResolvedValue(
        fakePost({ authorId: requesterId, status: ARCHIVED }),
      );

      await service.updatePublicationStatus(existing.id, ARCHIVED, requesterId);

      expect(postsRepository.updateStatus).toHaveBeenCalledWith(
        existing.id,
        { status: ARCHIVED },
        requesterId,
      );
    });

    it('allows unpublishing a post that was previously published', async () => {
      const requesterId = randUuid();
      const existing = fakePost({ authorId: requesterId, status: PUBLISHED });
      postsRepository.find.mockResolvedValue(existing);
      postsRepository.updateStatus.mockResolvedValue(
        fakePost({ authorId: requesterId, status: UNPUBLISHED }),
      );

      await service.updatePublicationStatus(
        existing.id,
        UNPUBLISHED,
        requesterId,
      );

      expect(postsRepository.updateStatus).toHaveBeenCalledWith(
        existing.id,
        { status: UNPUBLISHED },
        requesterId,
      );
    });

    it('allows republishing a previously unpublished post (a reversible action)', async () => {
      const requesterId = randUuid();
      const existing = fakePost({
        authorId: requesterId,
        status: UNPUBLISHED,
      });
      postsRepository.find.mockResolvedValue(existing);
      postsRepository.updateStatus.mockResolvedValue(
        fakePost({ authorId: requesterId, status: PUBLISHED }),
      );

      await service.updatePublicationStatus(
        existing.id,
        PUBLISHED,
        requesterId,
      );

      expect(postsRepository.updateStatus).toHaveBeenCalledWith(
        existing.id,
        { status: PUBLISHED },
        requesterId,
      );
    });
  });

  describe('delete', () => {
    // Ownership/existence checks now live in the repository (delete takes
    // both id and requesterId), so the service is a thin passthrough here.
    // Forbidden/NotFound behavior for delete belongs in the repository's
    // own test suite rather than here.
    it('delegates directly to the repository with the id and requesterId', async () => {
      const id = randUuid();
      const requesterId = randUuid();
      postsRepository.delete.mockResolvedValue(undefined);

      await service.delete(id, requesterId);

      expect(postsRepository.delete).toHaveBeenCalledWith(id, requesterId);
    });
  });

  describe('findMany', () => {
    it('passes the query and requesterId straight through to the repository', async () => {
      const query: PostQuery = { order: 'desc', page: 1, limit: 20 };
      const requesterId = randUuid();
      postsRepository.findMany.mockResolvedValue([fakePost()]);

      await service.findMany(query, requesterId);

      expect(postsRepository.findMany).toHaveBeenCalledWith(query, requesterId);
    });
  });

  describe('findManyPublished', () => {
    it('passes the query straight through to the repository', async () => {
      const query: PostQuery = { order: 'asc', page: 1, limit: 20 };
      postsRepository.findManyPublished.mockResolvedValue([
        fakePublishedPost(),
      ]);

      await service.findManyPublished(query);

      expect(postsRepository.findManyPublished).toHaveBeenCalledWith(query);
    });
  });

  describe('find', () => {
    it('returns the post when repository.find resolves it', async () => {
      const authorId = randUuid();
      const existing = fakePost({ authorId });
      postsRepository.find.mockResolvedValue(existing);

      const result = await service.find(existing.id, authorId);

      expect(postsRepository.find).toHaveBeenCalledWith(existing.id, authorId);
      expect(result).toBe(existing);
    });

    it('throws NotFoundException when repository.find resolves null', async () => {
      postsRepository.find.mockResolvedValue(null);

      await expect(service.find('missing', randUuid())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findPublishedBySlug', () => {
    it('returns the post when found', async () => {
      const existing = fakePublishedPost();
      postsRepository.findPublishedBySlug.mockResolvedValue(existing);

      const result = await service.findPublishedBySlug('my-first-post');

      expect(result).toBe(existing);
    });

    it('throws NotFoundException when not found', async () => {
      postsRepository.findPublishedBySlug.mockResolvedValue(null);

      await expect(service.findPublishedBySlug('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
