// test/auth-helpers.ts
import { INestApplication } from '@nestjs/common';
import { randEmail, randFullName, randPassword } from '@ngneat/falso';
import * as request from 'supertest';
import TestAgent from 'supertest/lib/agent';

export type TestUser = {
  name: string;
  email: string;
  password: string;
};

// falso generates realistic, varied data instead of hand-written fixtures —
// helps surface edge cases (unicode names, unusual-but-valid emails) that
// static fixtures like "Test User" / "test@example.com" never exercise.
export const buildTestUser = (overrides: Partial<TestUser> = {}): TestUser => ({
  name: randFullName(),
  email: randEmail(),
  password: randPassword({ size: 16 }),
  ...overrides,
});

export const signUpAndAuthenticate = async (
  app: INestApplication,
  user: TestUser = buildTestUser(),
): Promise<{ agent: TestAgent<request.Test>; user: TestUser }> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const agent = request.agent(app.getHttpServer());

  const res = await agent.post('/auth/sign-up/email').send(user);

  if (res.status !== 200 && res.status !== 201) {
    throw new Error(
      `Sign-up failed in test setup: ${res.status} ${JSON.stringify(res.body)}`,
    );
  }

  return { agent, user };
};
