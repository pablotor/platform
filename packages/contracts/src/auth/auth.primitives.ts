import { z } from 'zod';

// The PasswordSchema was thought to be used with the passwordCreationInput component
// It returns the id of the PasswordRequirement it is breaking instead of a message
export const PasswordSchema = z
  .string()
  .min(8, 'length')
  .max(128)
  .regex(/[A-Z]/, 'upper')
  .regex(/[0-9]/, 'number')
  .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/, 'special');
