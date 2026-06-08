/**
 * If this file grows larger than desired, you can split it into different config
 * files as following:
 * https://docs.nestjs.com/techniques/configuration#configuration-namespaces
 */

import type { Config } from './config.interface';

export default (): Config => ({
  nest: {
    port: Number(process.env.PORT) || 3000,
  },
  cors: {
    enabled: process.env.CORS_ENABLED === 'true',
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    title: process.env.SWAGGER_TITLE || 'PabloTor Platform',
    description: process.env.SWAGGER_DESCRIPTION || 'The PTP API description',
    version: process.env.SWAGGER_VERSION || '1.0',
    path: process.env.SWAGGER_PATH || 'api',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
});
