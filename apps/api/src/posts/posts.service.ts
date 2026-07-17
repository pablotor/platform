import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreatePost, PatchPost, PostQuery } from '@repo/contracts';

import { PostsRepository, PostWithAuthor } from './posts.repository';
import { buildSlug } from './posts.slug';

const MAX_SLUG_ATTEMPTS = 20;

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create(data: CreatePost, authorId: string): Promise<PostWithAuthor> {
    const slug = await this.resolveAvailableSlug(buildSlug(data.title));
    return this.postsRepository.create({ ...data, slug, authorId });
  }

  async patch(
    slug: string,
    data: PatchPost,
    requesterId: string,
  ): Promise<PostWithAuthor> {
    const post = await this.findPostOrThrow(slug);
    this.assertOwnership(post, requesterId);
    const { title, content } = data;
    return this.postsRepository.update(post.id, { title, content });
  }

  async delete(slug: string, requesterId: string): Promise<void> {
    const post = await this.findPostOrThrow(slug);
    this.assertOwnership(post, requesterId);
    await this.postsRepository.delete(post.id);
  }

  findMany(query: PostQuery): Promise<PostWithAuthor[]> {
    return this.postsRepository.findMany(query);
  }

  findBySlug(slug: string): Promise<PostWithAuthor> {
    return this.findPostOrThrow(slug);
  }

  private async findPostOrThrow(slug: string): Promise<PostWithAuthor> {
    const post = await this.postsRepository.findBySlug(slug);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  private assertOwnership(post: PostWithAuthor, requesterId: string): void {
    if (post.author.id !== requesterId) {
      throw new ForbiddenException(
        'You do not have permission to modify this post',
      );
    }
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
