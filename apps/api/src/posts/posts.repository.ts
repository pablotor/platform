import { Injectable } from '@nestjs/common';
import type {
  PostEntity,
  PostPublicQuery,
  PostQuery,
  PostStatus,
} from '@repo/contracts';

import { PrismaService } from '../common/prisma/prisma.service';

// A post as read from the DB, joined with the minimal author fields the
// response contract needs (see PostResponseSchema in packages/contracts).
export type PostWithAuthor = Omit<PostEntity, 'authorId'> & {
  author: { id: string; name: string };
};

export type PublishedPost = Omit<PostEntity, 'status' | 'publishedAt'> & {
  status: 'PUBLISHED';
  publishedAt: Date;
};

export type PublishedPostWithAuthor = Omit<PublishedPost, 'authorId'> & {
  author: { id: string; name: string };
};

export type CreatePostData = Pick<
  PostEntity,
  | 'authorId'
  | 'title'
  | 'slug'
  | 'content'
  | 'excerpt'
  | 'kicker'
  | 'category'
  | 'seoTitle'
  | 'seoDescription'
  | 'isFeatured'
>;

export type UpdatePostData = Partial<
  Pick<
    PostEntity,
    | 'title'
    | 'slug'
    | 'content'
    | 'excerpt'
    | 'kicker'
    | 'category'
    | 'seoTitle'
    | 'seoDescription'
    | 'isFeatured'
  >
>;

const AUTHOR_SELECT = { id: true, name: true } as const;

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePostData): Promise<PostEntity> {
    return this.prisma.blogPost.create({
      data,
    });
  }

  find(id: string, authorId: string): Promise<PostEntity | null> {
    return this.prisma.blogPost.findUnique({
      where: { id, authorId },
    });
  }

  findBySlug(slug: string): Promise<PostEntity | null> {
    return this.prisma.blogPost.findUnique({
      where: { slug },
    });
  }

  async findPublishedBySlug(
    slug: string,
  ): Promise<PublishedPostWithAuthor | null> {
    return this.prisma.blogPost.findUnique({
      where: { slug, status: 'PUBLISHED', publishedAt: { not: null } },
      include: { author: { select: AUTHOR_SELECT } },
    }) as Promise<PublishedPostWithAuthor | null>;
  }

  findMany(query: PostQuery, authorId: string): Promise<PostEntity[]> {
    const { order, page, limit } = query;
    return this.prisma.blogPost.findMany({
      where: { authorId },
      orderBy: { createdAt: order },
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: AUTHOR_SELECT } },
    });
  }

  findManyPublished(
    query: PostPublicQuery,
  ): Promise<PublishedPostWithAuthor[]> {
    const { authorId, order, page, limit } = query;
    return this.prisma.blogPost.findMany({
      where: { status: 'PUBLISHED', ...(authorId ? { authorId } : {}) },
      orderBy: { createdAt: order },
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: AUTHOR_SELECT } },
    }) as Promise<PublishedPostWithAuthor[]>;
  }

  update(
    id: string,
    data: UpdatePostData,
    authorId: string,
  ): Promise<PostEntity> {
    return this.prisma.blogPost.update({
      where: { id, authorId },
      data,
      include: { author: { select: AUTHOR_SELECT } },
    });
  }

  updateStatus(
    id: string,
    status: PostStatus,
    authorId: string,
  ): Promise<PostEntity> {
    return this.prisma.blogPost.update({
      where: { id, authorId },
      data: {
        status,
      },
      include: { author: { select: AUTHOR_SELECT } },
    });
  }

  async delete(id: string, authorId: string): Promise<void> {
    await this.prisma.blogPost.delete({ where: { id, authorId } });
  }
}
