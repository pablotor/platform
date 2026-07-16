import { Injectable } from '@nestjs/common';
import type { PostEntity, PostQuery } from '@repo/contracts';

import { PrismaService } from '../common/prisma/prisma.service';

// A post as read from the DB, joined with the minimal author fields the
// response contract needs (see PostResponseSchema in packages/contracts).
// Structurally identical to PostResponse — the service can return this
// straight through without any extra mapping step.
export type PostWithAuthor = Omit<PostEntity, 'authorId'> & {
  author: { id: string; name: string };
};

export type CreatePostData = {
  title: string;
  slug: string;
  content: string;
  authorId: string;
};

export type UpdatePostData = Partial<{
  title: string;
  content: string;
}>;

const AUTHOR_SELECT = { id: true, name: true } as const;

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePostData): Promise<PostWithAuthor> {
    return this.prisma.blogPost.create({
      data,
      include: { author: { select: AUTHOR_SELECT } },
    });
  }

  async findBySlug(slug: string): Promise<PostWithAuthor | null> {
    return this.prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: AUTHOR_SELECT } },
    });
  }

  async findMany(query: PostQuery): Promise<PostWithAuthor[]> {
    const { authorId, order, page, limit } = query;
    return this.prisma.blogPost.findMany({
      where: authorId ? { authorId } : undefined,
      orderBy: { createdAt: order },
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: AUTHOR_SELECT } },
    });
  }

  async update(id: string, data: UpdatePostData): Promise<PostWithAuthor> {
    return this.prisma.blogPost.update({
      where: { id },
      data,
      include: { author: { select: AUTHOR_SELECT } },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.blogPost.delete({ where: { id } });
  }
}
