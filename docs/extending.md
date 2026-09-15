# Extending the Platform — API

A practical, step-by-step guide for adding a new feature or domain to PTP's
**API**. Companion to `TESTING.md`, which explains the _why_ behind the
testing layers — this guide is the _how_, start to finish, for shipping one.

Frontend extension (adding the corresponding pages/components in `apps/web`)
is out of scope here and will get its own guide once those conventions are
settled.

Written against the `posts` feature as the reference example. Where a
convention isn't fully settled yet, it's marked **(assumption — confirm)**
rather than stated as fact.

## Code style

See `CODESTYLE.md` for the full set of conventions. Two things specifically
worth flagging here:

- **Arrow functions everywhere except regular class methods** — no
  exceptions, including lifecycle-hook methods like `onModuleInit`. Easy
  mistake to make while writing a new service/controller class.
- **Table names (`@@map`) match the Prisma model name, not the route name**
  — e.g. `blog_post` for `BlogPost`, even though the route is `/posts`. Don't
  rename a table to match a route decision made later, or vice versa.
- **Routes/folders plural, entity/type names singular** — `/posts`,
  `packages/contracts/src/posts/`, but `PostEntity`, `CreatePost`, not
  `PostsEntity`/`CreatePosts`.

---

---

## 1. Create a branch

```bash
git checkout develop
git pull
git checkout -b feature/<domain-name>
```

Naming: `type/short-description`, lowercase, hyphen-separated — mirrors
Conventional Commits (`feature/`, `fix/`, `chore/`, `docs/`, `refactor/`).

Example: `feature/blog-posts`

---

## 2. Define the use case

Before touching any code, write down — in the PR description or a scratch
doc — the actual use case in terms of **who can do what**, not just what the
data looks like. This is the step that catches missing requirements (like
delete, or read-permission scope) before they're discovered mid-implementation.

At minimum, answer:

- Who can create / read / update / delete this resource?
- Is it public or does it require auth?
- What's explicitly _out_ of scope for this pass? (Write these down too —
  they save you from re-litigating "should we add X" mid-review.)

---

## 3. Prisma schema + migration

Edit `apps/api/prisma/schema.prisma`, add the new model(s).

```bash
# generates the migration SQL without applying it — review before committing
yarn workspace ptp-api migrate:dev:create --name posts_add_blog_post

# review the generated SQL under apps/api/prisma/migrations/, then apply it
yarn workspace ptp-api migrate:dev

# regenerate the Prisma client to pick up the new model's types
yarn workspace ptp-api prisma:generate
```

`migrate:dev:create` first, rather than jumping straight to `migrate:dev`,
gives you a chance to catch an unintended migration (e.g. an accidental
column drop from a schema edit elsewhere) before it's applied to your local DB.

**Migration naming:** `<domain>_<what-it-does>`, snake_case, e.g.
`posts_add_blog_post`. Migration names can't contain `/` — Prisma only reads
the immediate children of `prisma/migrations/`, so a slash creates nested
folders it won't recognize rather than a nicely grouped name. Domain
prefixing gets you the same "related migrations cluster together" benefit
without breaking that constraint. Which branch/PR introduced a migration is
tracked by git history, not by the migration name itself.

**Table naming:** every model uses `@@map("snake_case_singular")`, matching
the **Prisma model name**, not the public API route name — e.g. `BlogPost`
maps to `@@map("blog_post")` even though the route is `/posts`. The table
name and the route name are independent; don't rename one to match the other.

---

## 4. Define contracts in `packages/contracts`

Per `TESTING.md`'s ordering: Primitive → Entity → Contract, composed via
`.pick()` / `.omit()` / `.extend()` / `.partial()` / `.merge()`. Never expose
the Entity schema directly as an API contract — always compose a
purpose-built `Create`/`Patch`/`Query`/`Response` schema from it, even if one
ends up looking identical to the entity for now.

File layout, one domain per folder, filenames prefixed with the domain so a
global search for e.g. "primitives" doesn't return one hit per domain:

```
packages/contracts/src/
  posts/
    posts.primitives.ts
    posts.entity.ts
    posts.contracts.ts   # Create/Patch/Query/Response
    index.ts
  common/                 # cross-domain utilities — e.g. responseTimestamp,
                          # a future generic pagination helper
  index.ts                # re-exports every domain
```

Array-returning endpoints don't need a separate `z.array(...)`-wrapped
schema in the domain's contracts file — `@ZodResponse({ type: [SomeDto] })`
handles arrays natively at the controller layer (see step 6).
When Pagination is required, add a generic helper in
`packages/contracts/src/common`, so it remains the same for every endpoint

**`packages/contracts` stays pure Zod — no Nest imports.** The Nest-specific
`createZodDto()` wrapper classes controllers actually consume live in
`apps/api/src/<domain>/<domain>.dto.ts`, one `class` per contract schema
(e.g. `CreatePostDto extends createZodDto(CreatePostSchema) {}`). This is
the layer boundary: contracts define the shape, `apps/api`'s DTOs adapt that
shape to what Nest's pipe/interceptor machinery expects.

Checklist:

- [ ] Primitives defined with real constraints (length, format) — not bare `z.string()`
- [ ] Entity schema mirrors the DB shape exactly
- [ ] Contract schemas composed from the entity, not hand-written duplicates
- [ ] Response schema deliberately shaped for the client — not a raw entity dump
- [ ] Exported from the domain's `index.ts` and re-exported from the package root
- [ ] Zero imports from Nest, Next, or React anywhere in `packages/contracts` — this is the rule that keeps the package framework-agnostic. If you find yourself reaching for a Nest utility (like `@nestjs/mapped-types`) here, stop — that's exactly the kind of scaffold-residue that has slipped in before

---

## 5. Controller tests (write these before the controller)

Colocate as `<domain>.controller.spec.ts` next to the controller file.
Service is mocked at this layer.

Minimum coverage per endpoint:

- [ ] Success case with a valid payload
- [ ] 401 if the endpoint requires auth and none is present
- [ ] 403 if an authorization/ownership rule applies and is violated
- [ ] 400 on invalid payload (validation failure)
- [ ] 404 if the endpoint targets a specific resource that may not exist

---

## 6. Implement the controller

- Route naming: flat resource nouns (`/posts`, not `/blog/posts`) unless
  there's a genuine parent-child ownership relationship that justifies
  nesting (e.g. `/posts/:slug/comments`) — see the naming discussion that
  settled on `/posts` over `/blog/posts` for the reasoning.
- Validation: `nestjs-zod`'s pipe against the contract schemas from step 4 —
  never `class-validator`.
- hand-write the controller/service/module, don't use `nest g resource <name>`.
  \*\* The generator defaults to `class-validator` DTOs and a heavier scaffold
  than these conventions need — established via the `posts` module, the first
  hand-written reference.
- **Response serialization**: pair each route decorator with
  `@ZodResponse({ type: SomeResponseDto })`, using a `createZodDto()`-wrapped
  response schema from the domain's `*.dto.ts` file (see step 4). For a list
  endpoint returning an array, use the shorthand
  `@ZodResponse({ type: [SomeResponseDto] })` rather than defining a
  separate `z.array(...)`-wrapped schema — `@ZodResponse` handles arrays
  natively. This superseded the older per-route `@ZodSerializerDto`
  decorator, but **`ZodSerializerInterceptor` must stay registered globally
  in `app.module.ts`** — per nestjs-zod's own docs, `@ZodResponse` depends on
  it and `cleanupOpenApiDoc` being set up correctly; it is NOT dead config,
  despite how it might look once nothing references `@ZodSerializerDto`
  directly anymore. (Corrected here after initially getting this wrong —
  worth double-checking anything else in these docs that looks like an
  obvious cleanup opportunity before actually removing it.)
- **Route protection is default-on, not opt-in.** The BetterAuth guard
  protects every route unless explicitly marked otherwise —
  `@AllowAnonymous()` on public endpoints (list, get-by-slug), no decorator
  needed on protected ones (create, patch, delete). This is the opposite of
  the more common "guard routes individually" pattern — don't add
  `@UseGuards(...)` per route, the global guard already applies.

---

## 7. Service unit tests

Repository (or `PrismaService`) is mocked at this layer. This is where
authorization/business-rule tests belong — e.g. "throws Forbidden if the
requester isn't the resource's owner" should be provable here, independent
of the DB or HTTP layer.

---

## 8. Repository (if warranted) + service implementation

A repository layer only earns its keep for entities with
ownership checks, status transitions, or non-trivial queries. Plain
pass-through CRUD can call `PrismaService` directly from the service.

Implement the service logic validated by step 7's tests.

---

## 9. E2E suite

Create `test/<domain>.e2e-spec.ts`. Real Postgres via testcontainers, no
mocks. Use the shared helpers — `signUpAndAuthenticate` for authenticated
requests, `buildTestUser`/`@ngneat/falso` for payload data — rather than
hand-rolling auth or fixtures per test file.

Run the full checklist from `TESTING.md`'s "Checklist for a new feature's
e2e suite" section, plus anything specific to this domain's business rules
(ownership checks, uniqueness constraints, ordering guarantees, etc.).

```bash
yarn workspace ptp-api test:e2e
```
