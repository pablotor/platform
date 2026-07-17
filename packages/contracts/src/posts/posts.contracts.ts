import { z } from 'zod';

import { responseTimestamp } from '../common/responseTimestamp';
import { PostEntitySchema } from './posts.entity';
import { PostTitleSchema } from './posts.primitives';

// Create: client supplies title + content only. Server derives id, slug,
// authorId, and timestamps. Extra validations added to reject titles
// like "!!!" that would generate an invalid slug
export const CreatePostSchema = PostEntitySchema.pick({
  content: true,
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
});
export type CreatePost = z.infer<typeof CreatePostSchema>;

// Patch: same shape, all optional — partial update, per the confirmed
// decision that editing a post doesn't require resending the whole thing.
// Slug is deliberately excluded — it's immutable after creation.
export const PatchPostSchema = CreatePostSchema.partial();
export type PatchPost = z.infer<typeof PatchPostSchema>;

// Query: list filters + sort direction + pagination bounds. No `total` in
// the response for v1 (confirmed) — page/limit still bound result size.
export const PostQuerySchema = z.object({
  authorId: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type PostQuery = z.infer<typeof PostQuerySchema>;

// Response: public shape. Embeds minimal author info (via a Prisma `include`
// at the repository layer, confirmed) rather than a bare authorId, so the
// frontend can render "by <name>" without a second fetch.
export const PostResponseSchema = PostEntitySchema.omit({
  authorId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  author: z.object({
    id: z.string(),
    name: z.string(),
  }),
  createdAt: responseTimestamp,
  updatedAt: responseTimestamp,
});
export type PostResponse = z.infer<typeof PostResponseSchema>;
