// lib/validation/contracts/auth.ts
import { string, z } from 'zod';

import { UserSchema } from '../entities/user.schema';

export const SignInSchema = UserSchema.pick({
  email: true,
}).extend({
  // You do not want password format checking during signin
  password: string().nonempty(),
});

export const SignUpSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
});

export type SignInContract = z.infer<typeof SignInSchema>;
export type SignUpContract = z.infer<typeof SignUpSchema>;
