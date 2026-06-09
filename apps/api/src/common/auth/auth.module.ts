import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { BetterAuthService } from './betterauth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

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
