import { z } from 'zod';

/**
 * Converts an empty string to undefined, so optional works well with inputs
 */
export const optionalStringField = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (val: string) => (val === '' ? undefined : val),
    schema.optional(),
  );
