import type { Config } from 'jest';
import { config as baseConfig } from './base';

export const nestConfig = {
  ...baseConfig,
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  moduleFileExtensions: [...baseConfig.moduleFileExtensions, 'mjs'],
  transform: {
    '^.+\\.(t|j|mj)s$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', decorators: true },
          transform: { legacyDecorator: true, decoratorMetadata: true },
          target: 'es2022',
        },
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@thallesp/nestjs-better-auth|better-auth|@better-auth|rou3|@noble|jose|kysely)/)',
  ],
} as const satisfies Config;
