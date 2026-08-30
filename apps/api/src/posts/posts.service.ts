import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreatePost,
  PostEntity,
  PostPublicQuery,
  PostQuery,
  PostStatus,
  UpdatePost,
} from '@repo/contracts';

import { PostsRepository, PublishedPostWithAuthor } from './posts.repository';
import { buildSlug } from './posts.slug';

const MAX_SLUG_ATTEMPTS = 20;

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  private async findPostOrThrow(
    id: string,
    authorId: string,
  ): Promise<PostEntity> {
    const post = await this.postsRepository.find(id, authorId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async create(data: CreatePost, requesterId: string): Promise<PostEntity> {
    const slug = await this.resolveAvailableSlug(
      data.slug || buildSlug(data.title),
    );
    return this.postsRepository.create({
      ...data,
      slug,
      authorId: requesterId,
    });
  }

  async update(
    id: string,
    data: UpdatePost,
    requesterId: string,
  ): Promise<PostEntity> {
    const post = await this.postsRepository.find(id, requesterId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.status === 'ARCHIVED') {
      throw new BadRequestException('An archived post cannot be modified');
    }
    return this.postsRepository.update(id, data, requesterId);
  }

  async updatePublicationStatus(
    id: string,
    newStatus: PostStatus,
    requesterId: string,
  ): Promise<PostEntity> {
    if (newStatus === 'DRAFT') {
      throw new BadRequestException(
        'A post publication status cannot be changed to draft.',
      );
    }
    const post = await this.postsRepository.find(id, requesterId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.status === 'ARCHIVED') {
      throw new BadRequestException('An archived post cannot be modified');
    }
    if (post.status === newStatus) {
      throw new BadRequestException(`Post is already ${newStatus}.`);
    }
    if (post.status === 'DRAFT' && newStatus === 'UNPUBLISHED') {
      throw new BadRequestException(
        'A draft post can only be published or archived.',
      );
    }
    return this.postsRepository.updateStatus(
      id,
      {
        status: newStatus,
        ...(post.status === 'DRAFT' && newStatus === 'PUBLISHED'
          ? { publishedAt: new Date() }
          : {}),
      },
      requesterId,
    );
  }

  async delete(id: string, requesterId: string): Promise<void> {
    await this.postsRepository.delete(id, requesterId);
  }

  findMany(query: PostQuery, requesterId: string): Promise<PostEntity[]> {
    return this.postsRepository.findMany(query, requesterId);
  }

  findManyPublished(
    query: PostPublicQuery,
  ): Promise<PublishedPostWithAuthor[]> {
    return this.postsRepository.findManyPublished(query);
  }

  find(id: string, requesterId: string): Promise<PostEntity> {
    return this.findPostOrThrow(id, requesterId);
  }

  async findPublishedBySlug(slug: string): Promise<PublishedPostWithAuthor> {
    const post = await this.postsRepository.findPublishedBySlug(slug);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  private async resolveAvailableSlug(baseSlug: string): Promise<string> {
    let candidate = baseSlug;
    let attempt = 1;

    while (await this.postsRepository.findBySlug(candidate)) {
      attempt += 1;
      candidate = `${baseSlug}-${attempt}`;
      if (attempt > MAX_SLUG_ATTEMPTS) {
        throw new ConflictException(
          'Could not generate a unique slug for this post',
        );
      }
    }

    return candidate;
  }
}
