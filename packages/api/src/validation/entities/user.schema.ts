import { z } from 'zod';
import { NameSchema, EmailSchema, PasswordSchema } from '../primitives';

export const UserSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});
