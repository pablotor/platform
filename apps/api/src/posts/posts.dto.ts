import {
  CreatePostSchema,
  PatchPostSchema,
  PostQuerySchema,
  PostResponseSchema,
} from '@repo/contracts';
import { createZodDto } from 'nestjs-zod';

export class CreatePostDto extends createZodDto(CreatePostSchema) {}
export class PatchPostDto extends createZodDto(PatchPostSchema) {}
export class PostQueryDto extends createZodDto(PostQuerySchema) {}
export class PostResponseDto extends createZodDto(PostResponseSchema) {}
