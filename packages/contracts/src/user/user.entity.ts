import { z } from 'zod';

import { EmailSchema, NameSchema } from './user.primitives';

export const UserEntitySchema = z.object({
  name: NameSchema,
  email: EmailSchema,
});

export type UserEntity = z.infer<typeof UserEntitySchema>;
