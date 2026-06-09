import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AuthenticationConfig } from '../config/config.interface';

@Injectable()
export class BetterAuthService {
  constructor(configService: ConfigService, prisma: PrismaService) {
    const authConfig =
      configService.getOrThrow<AuthenticationConfig>('authentication');
    return betterAuth({
      baseURL: authConfig.url,
      database: prismaAdapter(prisma, {
        provider: 'postgresql',
      }),
      trustedOrigins: authConfig.trusted,
      secret: authConfig.secret,
      basePath: 'auth',
    });
  }
}
