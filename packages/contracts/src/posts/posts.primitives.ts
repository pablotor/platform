import { z } from 'zod';

// IMPORTANT: DO NOT ADD REFINE TO PRIMITIVE SCHEMAS.
// WHEN USED IN THE ENTITY SCHEMA, BREAKS THE SERIALIZATION
// ATTACHED DIRECTLY TO THE CREATE/PATCH/UPDATE CONTRACT
export const PostTitleSchema = z.string().trim().min(5).max(200);

export const PostContentSchema = z.string().trim().min(1).max(50_000); // markdown, text-only

export const PostSlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be lowercase, hyphen-separated');

export const PostStatusSchema = z.enum([
  'DRAFT',
  'PUBLISHED',
  'UNPUBLISHED',
  'ARCHIVED',
]);

export type PostStatus = z.infer<typeof PostStatusSchema>;

export const CategorySchema = z.enum([
  'BACKEND',
  'FRONTEND',
  'ARCHITECTURE',
  'INFRA',
  'CODE',
  'EDITORIAL',
]);

export type Category = z.infer<typeof CategorySchema>;
