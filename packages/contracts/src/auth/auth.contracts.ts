// lib/validation/contracts/auth.ts
import { string, z } from 'zod';

import { UserEntitySchema } from '../user';
import { PasswordSchema } from './auth.primitives';

export const SignInSchema = UserEntitySchema.pick({
  email: true,
}).extend({
  // You do not want password format checking during signin
  password: string().nonempty(),
});

export const SignUpSchema = UserEntitySchema.pick({
  name: true,
  email: true,
}).extend({
  // You do not want password format checking during signin
  password: PasswordSchema,
});

export type SignInContract = z.infer<typeof SignInSchema>;
export type SignUpContract = z.infer<typeof SignUpSchema>;
