import { cleanupOpenApiDoc } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './common/config/config.interface';
import { PrismaClientExceptionFilter } from './common/prisma/prisma-client-exception.filter';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const nestConfig = configService.getOrThrow<NestConfig>('nest');
  const corsConfig = configService.getOrThrow<CorsConfig>('cors');
  const swaggerConfig = configService.getOrThrow<SwaggerConfig>('swagger');
  const webUrl = configService.getOrThrow<string>('general.webUrl');

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .build();
    const openApiDoc = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path, app, cleanupOpenApiDoc(openApiDoc));
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors({
      origin: webUrl,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
  }

  await app.listen(nestConfig.port);
};

void bootstrap();
