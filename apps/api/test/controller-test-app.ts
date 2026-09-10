/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  ExecutionContext,
  INestApplication,
  ModuleMetadata,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import request from 'supertest';

export type ControllerTestAppOptions = {
  controller: Type<unknown>;
  providers?: ModuleMetadata['providers'];
  /**
   * Handler (method) names on the controller reachable without a session —
   * should mirror the controller's own @AllowAnonymous() usage.
   *
   * This is a simulation, not a verification: it doesn't read the real
   * @AllowAnonymous()/@OptionalAuth() metadata (that would require the
   * real AuthGuard + a live BetterAuth session, which belongs at the e2e
   * layer via signUpAndAuthenticate). Keep this list in sync with the
   * controller by hand — a mismatch here means a controller test could
   * pass while the real route protection is wrong. The e2e suite is the
   * layer that actually proves @AllowAnonymous() is wired correctly.
   */
  publicHandlers?: string[];
};

/**
 * Boots a real Nest HTTP app for a single controller, wired with the same
 * global ZodValidationPipe / ZodSerializerInterceptor the real app uses, so
 * validation and serialization are genuinely exercised — but with the real
 * BetterAuth AuthGuard swapped for a test double controlled via
 * `setSession`. Auth stays a black box: no real session/cookie is ever
 * created here, matching how auth is already treated everywhere else in
 * this codebase.
 */
export const buildControllerTestApp = async ({
  controller,
  providers = [],
  publicHandlers = [],
}: ControllerTestAppOptions) => {
  let currentSession: UserSession | null = null;

  const moduleRef = await Test.createTestingModule({
    controllers: [controller],
    providers: [
      ...providers,
      { provide: APP_PIPE, useClass: ZodValidationPipe },
      { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
      {
        provide: APP_GUARD,
        useValue: {
          canActivate: (ctx: ExecutionContext) => {
            if (currentSession) {
              // Confirmed against @thallesp/nestjs-better-auth's actual
              // source (dist/index.mjs): its @Session() decorator reads
              // `request.session` via getRequestFromContext(context), which
              // resolves to the same object switchToHttp().getRequest()
              // returns for a REST controller.
              ctx.switchToHttp().getRequest().session = currentSession;
              return true;
            }
            if (publicHandlers.includes(ctx.getHandler().name)) {
              return true;
            }
            // A guard returning `false` makes Nest default to a 403
            // (ForbiddenException). No session at all should be a 401
            // instead — 403 is reserved for "authenticated but not
            // permitted" (the ownership checks tested via mocked service
            // rejections), so this has to be thrown explicitly.
            throw new UnauthorizedException();
          },
        },
      },
    ],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  await app.init();

  return {
    app,
    request: request(app.getHttpServer()),
    /** Pass a UserSession to simulate an authenticated request, or null for unauthenticated. */
    setSession: (session: UserSession | null) => {
      currentSession = session;
    },
  };
};
