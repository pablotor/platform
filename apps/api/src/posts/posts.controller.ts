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
  Put,
  Query,
} from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { Session } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import {
  CreatePostDto,
  PostQueryDto,
  PostQueryResponseDto,
  PostResponseDto,
  UpdatePostDto,
  UpdatePostStatusDto,
} from './posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ZodResponse({ type: PostResponseDto })
  create(@Body() dto: CreatePostDto, @Session() session: UserSession) {
    return this.postsService.create(dto, session.user.id);
  }

  @Put(':id')
  @ZodResponse({ type: PostResponseDto })
  put(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Session() session: UserSession,
  ) {
    return this.postsService.update(id, dto, session.user.id);
  }

  @Patch(':id/:status')
  @ZodResponse({ type: PostResponseDto })
  patchStatus(
    @Param() params: UpdatePostStatusDto,
    @Session() session: UserSession,
  ) {
    return this.postsService.updatePublicationStatus(
      params.id,
      params.status,
      session.user.id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @Session() session: UserSession) {
    return this.postsService.delete(id, session.user.id);
  }

  @Get()
  @ZodResponse({ type: PostQueryResponseDto })
  findMany(@Query() query: PostQueryDto, @Session() session: UserSession) {
    return this.postsService.findMany(query, session.user.id);
  }

  @Get(':id')
  @ZodResponse({ type: PostResponseDto })
  findBySlug(@Param('id') id: string, @Session() session: UserSession) {
    return this.postsService.find(id, session.user.id);
  }
}
