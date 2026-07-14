import type { Config } from 'jest';

export const config = {
  moduleFileExtensions: ['js', 'ts', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
} as const satisfies Config;
