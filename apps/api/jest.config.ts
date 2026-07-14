import { nestConfig } from '@repo/jest-config';
import type { Config } from 'jest';

const config = {
  ...nestConfig,
  collectCoverageFrom: ['**/*.(t|j)s'],
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: '../coverage',
} as const satisfies Config;

export default config;
