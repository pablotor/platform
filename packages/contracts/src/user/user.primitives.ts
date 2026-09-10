import { z } from 'zod';

export const NameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(64, 'Name must not exceed 64 characters')
  .nonempty('The name is required');

export const EmailSchema = z
  .email('Invalid email address')
  .nonempty('The email is required');
