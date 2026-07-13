import { z } from 'zod';

export const NameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(64, 'Name must not exceed 64 characters')
  .nonempty('The name is required');

export const EmailSchema = z
  .email('Invalid email address')
  .nonempty('The email is required');

// The PasswordSchema was thought to be used with the passwordCreationInput component
// It returns the id of the PasswordRequirement it is breaking instead of a message
export const PasswordSchema = z
  .string()
  .min(8, 'length')
  .max(128)
  .regex(/[A-Z]/, 'upper')
  .regex(/[0-9]/, 'number')
  .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/, 'special');
