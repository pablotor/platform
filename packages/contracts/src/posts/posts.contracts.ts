import { z } from 'zod';

import { responseTimestamp } from '../common/responseTimestamp';
import { PostEntitySchema } from './posts.entity';
import {
  PostSlugSchema,
  PostStatusSchema,
  PostTitleSchema,
} from './posts.primitives';

export const CreatePostSchema = PostEntitySchema.pick({
  content: true,
  excerpt: true,
  kicker: true,
  category: true,
  seoTitle: true,
  seoDescription: true,
  isFeatured: true,
}).extend({
  title: PostTitleSchema.refine(
    (value) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-zA-Z0-9]/g, '').length > 5,
    {
      message: 'must contain more than 5 letters or numbers',
    },
  ),
  slug: PostSlugSchema.optional(),
});
export type CreatePost = z.infer<typeof CreatePostSchema>;

// Update: same shape, all optional — partial update, per the confirmed
// decision that editing a post doesn't require resending the whole thing.
export const UpdatePostSchema = CreatePostSchema.omit({
  isFeatured: true,
})
  .extend({
    isFeatured: z.boolean(),
  })
  .partial();

export type UpdatePost = z.infer<typeof UpdatePostSchema>;

export const UpdatePostStatusSchema = PostEntitySchema.pick({
  id: true,
}).extend({
  status: PostStatusSchema,
});

export type UpdatePostStatus = z.infer<typeof UpdatePostStatusSchema>;

// GET posts/:id
// Authenticated post info
export const PostResponseSchema = PostEntitySchema.omit({
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  publishedAt: responseTimestamp.nullish(),
  createdAt: responseTimestamp,
  updatedAt: responseTimestamp,
});

export type PostResponse = z.infer<typeof PostResponseSchema>;

// GET posts/
// Authenticated post query. Gathers all post from authenticated user
export const PostQuerySchema = z.object({
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PostQuery = z.infer<typeof PostQuerySchema>;

export const PostQueryResponseSchema = z.array(
  PostResponseSchema.omit({ content: true }),
);

// GET public/posts/:slug
// Public post data
export const PostPublicResponseSchema = PostResponseSchema.omit({
  id: true,
  status: true,
  authorId: true,
  publishedAt: true,
  createdAt: true,
}).extend({
  author: z.object({
    id: z.string(),
    name: z.string(),
  }),
  publishedAt: responseTimestamp,
});

export type PostPublicResponse = z.infer<typeof PostPublicResponseSchema>;

// GET public/posts/
// Public published posts listing data
export const PostPublicQuerySchema = PostQuerySchema.extend({
  authorId: z.string().optional(),
});

export type PostPublicQuery = z.infer<typeof PostPublicQuerySchema>;

export const PostPublicQueryResponseSchema = z.array(
  PostPublicResponseSchema.omit({ content: true }),
);

export type PostPublicQueryResponse = z.infer<
  typeof PostPublicQueryResponseSchema
>;
