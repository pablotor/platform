import {
  PostPublicQueryResponseSchema,
  PostPublicQuerySchema,
  PostPublicResponseSchema,
} from '@repo/contracts';
import { createZodDto } from 'nestjs-zod';

export class PostPublicQueryDto extends createZodDto(PostPublicQuerySchema) {}
export class PostPublicQueryResponseDto extends createZodDto(
  PostPublicQueryResponseSchema,
) {}
export class PostPublicResponseDto extends createZodDto(
  PostPublicResponseSchema,
) {}
