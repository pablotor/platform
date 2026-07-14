import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import { ZodSerializerDto } from 'nestjs-zod';

import {
  CreatePostDto,
  PatchPostDto,
  PostListResponseDto,
  PostQueryDto,
  PostResponseDto,
} from './posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ZodSerializerDto(PostResponseDto)
  create(@Body() dto: CreatePostDto, @Session() session: UserSession) {
    return this.postsService.create(dto, session.user.id);
  }

  @Patch(':slug')
  @ZodSerializerDto(PostResponseDto)
  patch(
    @Param('slug') slug: string,
    @Body() dto: PatchPostDto,
    @Session() session: UserSession,
  ) {
    return this.postsService.patch(slug, dto, session.user.id);
  }

  @Delete(':slug')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('slug') slug: string, @Session() session: UserSession) {
    return this.postsService.delete(slug, session.user.id);
  }

  // Order matters: the bare GET must be declared before GET ':slug', or
  // Nest will never reach this one for a request to /posts.
  @Get()
  @AllowAnonymous()
  @ZodSerializerDto(PostListResponseDto)
  findMany(@Query() query: PostQueryDto) {
    return this.postsService.findMany(query);
  }

  @Get(':slug')
  @AllowAnonymous()
  @ZodSerializerDto(PostResponseDto)
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }
}
