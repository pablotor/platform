import { Module } from '@nestjs/common';

import { PrismaService } from '../common/prisma/prisma.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PrismaService],
})
export class PostsModule {}
