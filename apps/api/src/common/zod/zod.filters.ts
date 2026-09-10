import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  ZodSchemaDeclarationException,
  ZodSerializationException,
} from 'nestjs-zod';
import { ZodError } from 'zod';

@Catch(ZodSchemaDeclarationException)
export class ZodSchemaDeclarationExceptionFilter implements ExceptionFilter {
  private logger = new Logger(ZodSchemaDeclarationExceptionFilter.name);
  catch(exception: ZodSchemaDeclarationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    this.logger.error(`ZodSerializationException: ${exception.message}`);
    response.status(500).json({
      statusCode: 500,
      message: 'Missing nestjs-zod schema declaration',
    });
  }
}

@Catch(HttpException)
export class ZodHttpExceptionFilter extends BaseExceptionFilter {
  private logger = new Logger(ZodHttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();

      if (zodError instanceof ZodError) {
        this.logger.error(`ZodSerializationException: ${zodError.message}`);
      }
    }

    super.catch(exception, host);
  }
}
