/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { buildTestUser, signUpAndAuthenticate } from './auth-helpers';
import { cleanDatabase } from './db-helpers';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    prisma = moduleRef.get(PrismaService);
  });

  afterEach(async () => {
    await cleanDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('sign-up', () => {
    it('creates a user and sets a session cookie', async () => {
      const user = buildTestUser();

      const res = await request(app.getHttpServer())
        .post('/auth/sign-up/email')
        .send(user);

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      expect(dbUser).not.toBeNull();
    });

    it('rejects a duplicate email with a 4xx', async () => {
      const user = buildTestUser();
      await request(app.getHttpServer()).post('/auth/sign-up/email').send(user);

      const res = await request(app.getHttpServer())
        .post('/auth/sign-up/email')
        .send(user);

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    });

    it('rejects an invalid email format with a 4xx', async () => {
      const user = buildTestUser({ email: 'not-an-email' });

      const res = await request(app.getHttpServer())
        .post('/auth/sign-up/email')
        .send(user);

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    });
  });

  describe('sign-in', () => {
    it('authenticates with correct credentials and sets a session cookie', async () => {
      const user = buildTestUser();
      await request(app.getHttpServer()).post('/auth/sign-up/email').send(user);

      const res = await request(app.getHttpServer())
        .post('/auth/sign-in/email')
        .send({ email: user.email, password: user.password });

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('rejects an incorrect password with 401', async () => {
      const user = buildTestUser();
      await request(app.getHttpServer()).post('/auth/sign-up/email').send(user);

      const res = await request(app.getHttpServer())
        .post('/auth/sign-in/email')
        .send({ email: user.email, password: randPassword({ size: 16 }) });

      expect(res.status).toBe(401);
    });

    it('rejects a non-existent email with 401', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/sign-in/email')
        .send({
          email: 'nobody@example.com',
          password: randPassword({ size: 16 }),
        });

      expect(res.status).toBe(401);
    });
  });

  describe('session-protected routes', () => {
    it('allows an authenticated agent through a protected route', async () => {
      const { agent } = await signUpAndAuthenticate(app);

      const res = await agent.get('/auth/get-session');

      expect(res.status).toBe(200);
      expect(res.body?.user).toBeDefined();
    });
  });
});
