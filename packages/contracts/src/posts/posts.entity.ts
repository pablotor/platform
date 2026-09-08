import { z } from 'zod';

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

// Mirrors the BlogPost Prisma model exactly. Never exposed directly as an
// API contract. It composes raw validators with .nullish()/.default().
export const PostEntitySchema = z.object({
  id: z.string(),

  // Core content
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
  isFeatured: z.boolean().default(false),
  status: _status.default('DRAFT'),
  publishedAt: z.date().nullish(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PostEntity = z.infer<typeof PostEntitySchema>;
