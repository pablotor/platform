# Code Style

Conventions that apply across the monorepo. This document grows as new
decisions get made — if something isn't covered here yet, it hasn't been
settled as a project-wide rule.

## Functions

Arrow functions everywhere it's syntactically possible — **except regular
class methods**, which use standard method syntax:

```ts
// ✅ standalone / exported functions
const buildSlug = (title: string): string => { ... };

// ✅ regular class methods
class PostsService {
  create(dto: CreatePostDto) { ... }
}

// ❌ don't do this
class PostsService {
  create = (dto: CreatePostDto) => { ... }
}
```

## Validation

Zod + `nestjs-zod` for all API validation. Never `class-validator` /
`class-transformer` — replaced deliberately (see the platform's philosophy
notes on library selection).

**Never `.refine()` a field on the Entity schema or a shared primitive that
also feeds a Response schema.** A refined field breaks serialization for
any Response contract composed from it — the refinement's wrapped internal
representation isn't something the response-serialization path can
introspect cleanly. This also makes semantic sense independent of the
technical limitation: a refinement like "title must contain more than 5
real characters" is an _input_ constraint — it has nothing to say about
data already sitting in the DB on the way out.

The fix: don't `.pick()` the field itself onto the Entity into a Create/Patch
schema. Instead, `.pick()` only the _other_ fields, and `.extend()` the
refined field back on as an independent definition local to that contract:

```ts
// ❌ — refines the shared primitive; breaks PostResponseSchema, which is
// also composed from PostEntitySchema and inherits the same title field
export const PostTitleSchema = z.string().trim().min(1).max(200).refine(...);

// ✅ — entity/primitive stays plain; the refinement lives only on the
// Create contract, where it's actually meaningful
export const CreatePostSchema = PostEntitySchema.pick({ content: true }).extend({
  title: PostTitleSchema.refine(...),
});
```

## File naming

- **Shared package files** (e.g. `packages/contracts`): domain-prefixed —
  `posts.primitives.ts`, `posts.entity.ts`, `posts.contracts.ts` — not bare
  `primitives.ts` / `entity.ts`, so a global search for a filename doesn't
  return one hit per domain.
- **React components**: not kebab-case, despite that being the current
  ecosystem default — component filenames should be easy to locate by name
  without a mental case-conversion step. (See the platform's philosophy
  notes for the reasoning.)

## Routes

Flat resource nouns (`/posts`) rather than domain-nested paths (`/blog/posts`)
unless there's a genuine parent-child ownership relationship that justifies
nesting (e.g. `/posts/:slug/comments`).

**Plural vs. singular:** routes, folders, and package/domain names are
**plural** — they describe a collection (`/posts`, `packages/contracts/src/posts/`).
Entity and type names are **singular** — each instance is one thing
(`PostEntity`, not `PostsEntity`; `CreatePost`, not `CreatePosts`). A route
returns many; a type describes one.

## Database naming

Every Prisma model uses `@@map("snake_case_singular")`, matching the
**model name**, not the public API route name. E.g. `BlogPost` maps to
`@@map("blog_post")` even though the route is `/posts`. Table names and
route names are independent decisions — don't rename one because the other
changed.

Migration names: `<domain>_<what-it-does>`, snake_case, e.g.
`posts_add_blog_post`. No `/` — Prisma only reads the immediate children of
`prisma/migrations/`, so a slash produces nested folders it won't recognize.
Which branch/PR introduced a migration is tracked by git history, not
encoded into the name.

## Repository layer

A repository layer is only introduced where it earns its keep: entities with
ownership checks, status transitions, or non-trivial queries. Plain
pass-through CRUD entities call `PrismaService` directly from the service —
don't add a repository "for consistency" if it has nothing to do.

## Testing

Mock collaborators with a single `jest.Mocked<Public<T>>` annotation on the
mock object, not a per-method `jest.MockedFunction<T['method']>` cast:

```ts
// ✅
const postsRepository: jest.Mocked<Public<PostsRepository>> = {
  create: jest.fn(),
  findBySlug: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// ❌ — repetitive, and doesn't catch a missing method at compile time
const postsRepository = {
  create: jest.fn() as jest.MockedFunction<PostsRepository['create']>,
  findBySlug: jest.fn() as jest.MockedFunction<PostsRepository['findBySlug']>,
  // ...
};
```

`jest.Mocked<T>` types the whole object against the real class in one
annotation — less repetition, and if the real class ever gains a new method,
TypeScript flags the mock object as incomplete instead of silently letting
the new method go unmocked.

**Use `Public<T>` (from `test/mock-types.ts`), not the raw class, once that
class has any constructor-injected dependency.** A class with a `private
readonly` constructor parameter (e.g. `PostsService`'s `postsRepository`, or
any repository that later injects `PrismaService`) becomes nominally typed —
TypeScript will demand the mock object also supply that private field,
which a plain mock obviously can't and shouldn't do. `Public<T>` strips that
requirement by producing a fresh, non-nominal type with the same public
shape. Applies the moment a class gains its first private dependency, not
just to services that already have one — worth using by default on any
class-based mock so it doesn't need fixing later.

If you need to pass a `Public<T>`-typed mock into something that demands the
real nominal type (e.g. a direct `new SomeService(mockRepository)` call,
rather than a Nest testing module's loosely-typed `useValue`), cast at that
specific call site: `mockRepository as unknown as PostsRepository`. Don't
add this cast preemptively on a class that doesn't need it yet — add it when
the class actually gains a private dependency and the compiler tells you to.

Test data: use `@ngneat/falso` for fields a test treats as opaque (ids,
names, emails, freeform content) — same reasoning as `buildTestUser` in the
e2e auth helpers. Keep a field as a literal instead when a test is
specifically asserting a _transformation_ of it (e.g. `title` → `slug`) —
randomizing it would force the test to either weaken its assertion or
recompute the expected value using the same function being tested, which
makes the test circular rather than a check against a known-correct example.
