import { z } from 'zod';

export const PostTitleSchema = z.string().trim().min(1).max(200);

export const PostContentSchema = z.string().trim().min(1).max(50_000); // markdown, text-only for v1

export const PostSlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be lowercase, hyphen-separated');
