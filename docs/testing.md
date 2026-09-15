# Testing Guide

This document describes how we test the API, and captures the non-obvious
gotchas we hit while setting this up so nobody has to rediscover them.

## Philosophy: contract-first, test-first

For every new feature we follow this order:

1. Define the use case (who can do what, not just "what does the table look like")
2. Prisma schema + migration
3. Zod contract in the shared contract package: compose Primitive →
   Entity → Contract schemas (`CreateXSchema`, `UpdateXSchema`,
   `PatchXSchema`, `QueryXSchema`, `XResponseSchema`) via `.pick()`/`.omit()`/
   `.extend()`/`.partial()`/`.merge()` — designed, not derived 1:1 from the
   DB model, and never exposing the entity schema directly as an API contract
4. Controller tests: payload validation + auth/authz, service mocked
5. Implement the controller
6. Service unit tests: business logic, repository mocked
7. Implement the repository (if warranted — see below) and service
8. Full e2e suite against a real test database
9. Update OpenAPI / bump the contract package version if published

## Test layers

| Layer                | What it verifies                                          | What's mocked                   | Speed  |
| -------------------- | --------------------------------------------------------- | ------------------------------- | ------ |
| Controller unit test | Routing, validation pipe, status codes, auth/authz wiring | Service                         | Fast   |
| Service unit test    | Business logic, authorization rules, error mapping        | Repository (or `PrismaService`) | Fast   |
| E2E test             | The full stack, including real Postgres constraints       | Nothing — real testcontainer    | Slower |

Don't skip the e2e layer even though it's slower — it's the only layer that
catches things like a unique constraint returning a raw Prisma error instead
of a `409`.

## Repository layer

We use a **thin repository layer only where it earns its keep**: entities
with ownership checks, status transitions, or non-trivial queries. Plain
pass-through CRUD entities can have their service call `PrismaService`
directly. Either way, Prisma error → domain exception mapping is centralized
(see `PrismaClientExceptionFilter`), not duplicated per service.

## Code style

Arrow functions everywhere it's syntactically possible (including class
fields for methods that need lifecycle-hook `this` binding, e.g.
`onModuleInit = async () => { ... }` on `PrismaService`).

---

## E2E test infrastructure

### Stack

- `@testcontainers/postgresql` — spins up a real, disposable Postgres per test run
- One container for the **entire run**, not one per test file
- Schema applied via `prisma db push` against the container
- Database cleaned between tests via `TRUNCATE ... CASCADE`, not container restarts
- `PrismaService` is resolved from the Nest testing module in every e2e test —
  **never instantiate a raw `PrismaClient`/`new PrismaService(...)` in a test**.
  Using the real DI-provided instance means tests exercise the exact adapter
  config (`PrismaPg`, connection pooling) that production uses, and avoids
  opening a second connection pool against the same container.

### Files

```
test/
  jest-e2e.json              # Jest config for the e2e project
  jest-setup-env.ts          # setupFiles: reloads DB env vars into process.env
  testcontainers-setup.ts    # globalSetup: starts the container, pushes schema
  testcontainers-teardown.ts # globalTeardown: stops the container, cleans temp file
  db-helpers.ts              # cleanDatabase(prisma) — truncates all tables
  auth-helpers.ts            # buildTestUser, signUpAndAuthenticate
  *.e2e-spec.ts
```

### `jest-e2e.json`

```json
{
  "moduleFileExtensions": ["js", "json", "ts", "mjs"],
  "rootDir": ".",
  "globalSetup": "./testcontainers-setup.ts",
  "globalTeardown": "./testcontainers-teardown.ts",
  "setupFiles": ["./jest-setup-env.ts"],
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j|mj)s$": [
      "@swc/jest",
      {
        "jsc": {
          "parser": { "syntax": "typescript", "decorators": true },
          "transform": { "legacyDecorator": true, "decoratorMetadata": true },
          "target": "es2022"
        }
      }
    ]
  },
  "transformIgnorePatterns": [
    "/node_modules/(?!(@thallesp/nestjs-better-auth|better-auth|@better-auth|rou3|@noble|jose|kysely)/)"
  ]
}
```

### `pretest:e2e` script

```json
{
  "scripts": {
    "pretest:e2e": "prisma generate",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

Prisma 7's `db push` no longer runs `generate` automatically, so this keeps
the generated client in sync with whatever `schema.prisma` currently looks
like before every e2e run.

---

## ⚠️ Gotcha #1: `globalSetup` env vars don't reach your test files

**Symptom:** the app connects to your real dev database (`.env.local`)
instead of the testcontainer, even though `globalSetup` clearly ran and
started a fresh container.

**Cause:** Jest's `globalSetup` and `globalTeardown` run in a shared context
with each other (so `globalThis.__X__` survives between them), but **test
files run in a separate context** and never see `process.env` mutations made
inside `globalSetup`.

**Fix:** write the connection info to a temp file in `globalSetup`, then load
it into `process.env` via `setupFiles` — `setupFiles` scripts _do_ run inside
each test file's own context, before that file's imports (and therefore
before `ConfigModule`/`AppModule`) execute.

```typescript
// testcontainers-setup.ts (excerpt)
writeFileSync(ENV_FILE, JSON.stringify(dbEnv));
```

```typescript
// jest-setup-env.ts
const dbEnv = JSON.parse(readFileSync(ENV_FILE, 'utf-8'));
Object.assign(process.env, dbEnv);
```

### Corollary: match your config's actual env var shape

If your app config builds the connection string from **component vars**
(`POSTGRES_USER`, `DB_HOST`, `DB_PORT`, etc.) rather than reading a single
`DATABASE_URL`, the temp file must set those same component vars — setting
`DATABASE_URL` alone silently does nothing and the app falls back to
whatever's already in `process.env` from `.env.local`. Use
`container.getHost()` and `container.getMappedPort(5432)` (not a hardcoded
`5432`) to get the real dynamically-assigned port.

---

## ⚠️ Gotcha #2: ESM-only dependencies fail to parse under Jest

**Symptom:**

```
SyntaxError: Cannot use import statement outside a module
```

pointing at a `.mjs` file somewhere under `node_modules`.

**Cause:** Jest ignores `node_modules` for transformation by default.
`better-auth` and its NestJS integration ship as ESM and pull in several
ESM-only sub-dependencies.

**Fix:** widen `transformIgnorePatterns` to explicitly transform those
packages instead of skipping them. The current allowlist
(`@thallesp/nestjs-better-auth|better-auth|@better-auth|rou3|@noble|jose|kysely`)
was built incrementally, one failing import at a time. **If you upgrade
`better-auth` and hit this error again, add the new package name to this
group** rather than assuming the infra is broken.

Also requires `@swc/core` installed alongside `@swc/jest` (peer dependency,
not bundled) and explicit `jsc` parser options for TS + decorator support —
NestJS's DI relies on `decoratorMetadata: true` to resolve constructor
parameter types.

---

## Auth in e2e tests

Every e2e test that needs an authenticated request uses the shared helper —
don't hand-roll sign-up/sign-in per test file.

```typescript
import { signUpAndAuthenticate } from './auth-helpers';

const { agent, user } = await signUpAndAuthenticate(app);
const res = await agent.get('/some/protected/route');
```

`signUpAndAuthenticate` returns a `supertest` **agent** (`request.agent(...)`),
not a one-off `request(...)` call — the agent persists the session cookie
across requests, matching real browser behavior. Using plain `request(...)`
per call will not carry the auth cookie forward.

Test user data is generated with `@ngneat/falso` (`buildTestUser()`) rather
than static fixtures, to exercise realistic/varied input instead of always
hitting the same `test@example.com` shape.

---

## Database cleanup between tests

We truncate all tables in `afterEach`, we do not spin up a new container per
test:

```typescript
afterEach(async () => {
  await cleanDatabase(prisma); // prisma resolved via moduleRef.get(PrismaService)
});
```

If truncation ever becomes a bottleneck, the next step is transaction-based
isolation (wrap each test in a transaction, roll back after) — not
per-test containers.

---

## Checklist for a new feature's e2e suite

- [ ] Test file named `*.e2e-spec.ts` under `test/`
- [ ] `PrismaService` resolved via `moduleRef.get(PrismaService)`, not instantiated directly
- [ ] `afterEach` calls `cleanDatabase(prisma)`
- [ ] `afterAll` calls `app.close()` (disconnects Prisma via `OnModuleDestroy`)
- [ ] Authenticated requests go through `signUpAndAuthenticate`
- [ ] Test payloads built with `@ngneat/falso`, not hardcoded fixtures
- [ ] Covers: valid payload, invalid payload (validation), unauthenticated (401), unauthorized/wrong owner (403 if applicable), not-found (404), conflict (409 if applicable, e.g. unique constraint)
