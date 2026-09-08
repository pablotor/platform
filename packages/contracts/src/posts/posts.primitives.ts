import { z } from 'zod';

// Raw validators (_title, _slug, …) hold only value-shape rules, no presence modifiers.
export const _title = z.string().trim().min(5).max(200);
export const _content = z.string().trim().min(1).max(50_000);
export const _slug = z
  .string()
  .min(5)
  .max(32)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be lowercase, hyphen-separated');
export const _status = z.enum([
  'DRAFT',
  'PUBLISHED',
  'UNPUBLISHED',
  'ARCHIVED',
]);
export const _category = z.enum([
  'BACKEND',
  'FRONTEND',
  'ARCHITECTURE',
  'INFRA',
  'CODE',
  'EDITORIAL',
]);
export const _excerpt = z.string();
export const _kicker = z.string();
export const _seoTitle = z.string();
export const _seoDescription = z.string();

export type Category = z.infer<typeof _category>;
export type PostStatus = z.infer<typeof _status>;
