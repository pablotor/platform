import {
  CreatePostSchema,
  PostQueryResponseSchema,
  PostQuerySchema,
  PostResponseSchema,
  UpdatePostSchema,
  UpdatePostStatusSchema,
} from '@repo/contracts';
import { createZodDto } from 'nestjs-zod';

export class CreatePostDto extends createZodDto(CreatePostSchema) {}
export class UpdatePostDto extends createZodDto(UpdatePostSchema) {}
export class UpdatePostStatusDto extends createZodDto(UpdatePostStatusSchema) {}
export class PostQueryDto extends createZodDto(PostQuerySchema) {}
export class PostQueryResponseDto extends createZodDto(
  PostQueryResponseSchema,
) {}
export class PostResponseDto extends createZodDto(PostResponseSchema) {}
