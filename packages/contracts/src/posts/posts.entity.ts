import { z } from 'zod';

import {
  CategorySchema,
  PostContentSchema,
  PostSlugSchema,
  PostStatusSchema,
  PostTitleSchema,
} from './posts.primitives';

// Mirrors the BlogPost Prisma model exactly. Never exposed directly as an
// API contract — always compose a purpose-built Create/Patch/Query/Response
// schema from this instead.
export const PostEntitySchema = z.object({
  id: z.string(),

  // Core content
  title: PostTitleSchema,
  slug: PostSlugSchema,
  content: PostContentSchema,
  excerpt: z.string().nullish(),
  kicker: z.string().nullish(),

  authorId: z.string(),

  // Metadata
  category: CategorySchema.nullish(),

  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),

  // Publishing
  isFeatured: z.boolean().default(false),
  status: PostStatusSchema.default('DRAFT'),
  publishedAt: z.date().nullish(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PostEntity = z.infer<typeof PostEntitySchema>;
