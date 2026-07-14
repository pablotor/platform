import { nestConfig } from '@repo/jest-config';
import type { Config } from 'jest';

const config = {
  ...nestConfig,
  rootDir: '.',
  globalSetup: './testcontainers-setup.ts',
  globalTeardown: './testcontainers-teardown.ts',
  setupFiles: ['./jest-setup-env.ts'],
  testRegex: '.e2e-spec.ts$',
  collectCoverage: false,
} as const satisfies Config;

export default config;
