import { z } from 'zod';

import {
  PostContentSchema,
  PostSlugSchema,
  PostTitleSchema,
} from './posts.primitives';

// Mirrors the BlogPost Prisma model exactly. Never exposed directly as an
// API contract — always compose a purpose-built Create/Patch/Query/Response
// schema from this instead.
export const PostEntitySchema = z.object({
  id: z.string(),
  title: PostTitleSchema,
  slug: PostSlugSchema,
  content: PostContentSchema,
  authorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PostEntity = z.infer<typeof PostEntitySchema>;
