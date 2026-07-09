import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import { PrismaService } from '../prisma/prisma.service';
import { BetterAuthService } from './betterauth.service';

@Module({
  imports: [
    BetterAuthModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const prisma = new PrismaService(configService);
        const auth = new BetterAuthService(configService, prisma);
        return {
          auth,
        };
      },
    }),
  ],
  providers: [PrismaService, BetterAuthService],
})
export class AuthModule {}
