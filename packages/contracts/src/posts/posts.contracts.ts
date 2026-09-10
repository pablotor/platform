import { z } from 'zod';

import { optionalStringField } from '../common/optionalStringField';
import { responseTimestamp } from '../common/responseTimestamp';
import {
  _category,
  _content,
  _excerpt,
  _kicker,
  _seoDescription,
  _seoTitle,
  _slug,
  _status,
  _title,
} from './posts.primitives';

// Input/contract schemas compose the same raw validators with .optional()
// (+ emptyToUndefined preprocessing where forms are involved) — never derived
// from the entity's nullish fields.
// Use z.input<> for anything pre-parse (form values, request bodies you're
// about to validate), and z.infer<> only for post-parse data.

export const CreatePostSchema = z.object({
  title: _title.refine(
    (value) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '').length > 5,
    { message: 'must contain more than 5 letters or numbers' },
  ),
  content: _content,
  slug: optionalStringField(_slug),
  excerpt: optionalStringField(_excerpt),
  kicker: optionalStringField(_kicker),
  category: optionalStringField(_category),
  seoTitle: optionalStringField(_seoTitle),
  seoDescription: optionalStringField(_seoDescription),
  isFeatured: z.boolean().optional(),
});
export type CreatePostPayload = z.input<typeof CreatePostSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;

// Update: same shape, all optional — partial update, per the confirmed
// decision that editing a post doesn't require resending the whole thing.
export const UpdatePostSchema = CreatePostSchema.partial();

export type UpdatePostPayload = z.input<typeof UpdatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;

export const UpdatePostStatusSchema = z.object({
  id: z.string(),
  status: _status,
});

export type UpdatePostStatus = z.infer<typeof UpdatePostStatusSchema>;

// GET posts/:id
// Authenticated post info
export const PostResponseSchema = z.object({
  id: z.string(),
  title: _title,
  slug: _slug,
  content: _content,
  excerpt: _excerpt.nullish(),
  kicker: _kicker.nullish(),

  authorId: z.string(),

  // Metadata
  category: _category.nullish(),

  seoTitle: _seoTitle.nullish(),
  seoDescription: _seoDescription.nullish(),

  // Publishing
  isFeatured: z.boolean(),
  status: _status,
  publishedAt: responseTimestamp.nullish(),
  createdAt: responseTimestamp,
  updatedAt: responseTimestamp,
});

export type PostResponse = z.infer<typeof PostResponseSchema>;

// GET posts/
// Authenticated post query. Gathers all post from authenticated user
export const PostQuerySchema = z.object({
  order: z.enum(['asc', 'desc']).default('desc'),
  // page: z.coerce.number().int().positive().default(1),
  // limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PostQueryPayload = z.input<typeof PostQuerySchema>;
export type PostQuery = z.infer<typeof PostQuerySchema>;

export const PostQueryResponseSchema = z.array(
  PostResponseSchema.omit({ content: true }),
);

export type PostQueryResponse = z.infer<typeof PostQueryResponseSchema>;

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

export type PostPublicQueryPayload = z.input<typeof PostPublicQuerySchema>;
export type PostPublicQuery = z.infer<typeof PostPublicQuerySchema>;

export const PostPublicQueryResponseSchema = z.array(
  PostPublicResponseSchema.omit({ content: true }),
);

export type PostPublicQueryResponse = z.infer<
  typeof PostPublicQueryResponseSchema
>;
