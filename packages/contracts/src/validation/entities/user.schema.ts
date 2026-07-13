import { z } from 'zod';

import { EmailSchema, NameSchema, PasswordSchema } from '../primitives';

export const UserSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});
