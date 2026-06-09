import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const auth = betterAuth({
  baseURL: process.env.AUTH_URL,
  trustedOrigins: JSON.parse(process.env.AUTH_TRUSTED_URLS!),
  secret: process.env.AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
});
