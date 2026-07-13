import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { AuthenticationConfig } from '../config/config.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BetterAuthService {
  constructor(configService: ConfigService, prisma: PrismaService) {
    const authConfig =
      configService.getOrThrow<AuthenticationConfig>('authentication');
    return betterAuth({
      baseURL: authConfig.url,
      basePath: 'auth',
      database: prismaAdapter(prisma, {
        provider: 'postgresql',
      }),
      trustedOrigins: authConfig.trusted,
      secret: authConfig.secret,
      logger: new Logger('BetterAuth'),
      emailAndPassword: {
        enabled: true,
      },
    });
  }
}
