import z from 'zod';

export const responseTimestamp = z.codec(z.date(), z.iso.datetime(), {
  decode: (date) => date.toISOString(),
  encode: (isoString) => new Date(isoString),
});
