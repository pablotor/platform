import { Controller, Get, Param, Query } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import {
  PostPublicQueryDto,
  PostPublicQueryResponseDto,
  PostPublicResponseDto,
} from './posts.public.dto';
import { PostsService } from './posts.service';

@Controller('public/posts')
@AllowAnonymous()
export class PostsPublicController {
  constructor(private readonly postsService: PostsService) {}
  @Get()
  @ZodResponse({ type: PostPublicQueryResponseDto })
  findManyPublished(@Query() query: PostPublicQueryDto) {
    return this.postsService.findManyPublished(query);
  }

  @Get(':slug')
  @ZodResponse({ type: PostPublicResponseDto })
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findPublishedBySlug(slug);
  }
}
