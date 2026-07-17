import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

import { AuthModule } from './common/auth/auth.module';
import appConfig from './common/config/config';
import { PrismaService } from './common/prisma/prisma.service';
import {
  ZodHttpExceptionFilter,
  ZodSchemaDeclarationExceptionFilter,
} from './common/zod/zod.filters';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env.local',
        '.env.development',
        '.env.staging',
        '.env.production',
      ],
      load: [appConfig],
    }),
    PostsModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ZodHttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ZodSchemaDeclarationExceptionFilter,
    },
  ],
})
export class AppModule {}
