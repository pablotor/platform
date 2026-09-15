# Code Style

Conventions that I apply across the monorepo. This document grows as new
decisions get made

## File naming

- **API layer** (NestJS): kebab-case throughout, using Nest's own
  conventions (`.controller.ts`, `.service.ts`, `.module.ts`, etc.), with
  the folder matching the route/resource name — e.g. `src/post-comments/`,
  `post-comments.controller.ts`.
- **Everything else** (contracts, libs, and other shared packages):
  camelCase, and the domain prefix tracks the **model name**, not the API
  route — same reasoning as the model/route split in Database naming
  (`PostComment` → `post_comment` regardless of the `/post-comments`
  route). A multi-word model like `PostComment` produces a `postComment/`
  folder with `postComment.primitives.ts`, `postComment.entity.ts`,
  `postComment.contracts.ts` — even though the API's own folder for the
  same feature is `post-comments`. The two layers are allowed to disagree
  on casing and pluralization because they're naming different things:
  one names a route, the other names a model.
- **React components**: not kebab-case, despite that being the current
  ecosystem default — component filenames should be easy to locate by name
  without a mental case-conversion step. **Exception**: external packages
  used as is (like tiptap simple editor) are allowed to remain as they
  are.

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
function buildSlug(title: string) { ... }

class PostsService {
  create = (dto: CreatePostDto) => { ... }
}
```

## Validation

Zod + `nestjs-zod` for all API validation. Never `class-validator` /
`class-transformer` — replaced deliberately (see the platform's philosophy
notes on library selection).

The same schemas (from `packages/contracts`) drive validation in **two
separate places**: API (`ZodValidationPipe`, registered globally via
`APP_PIPE` in `app.module.ts`) and web (the `useForm` hook). A schema is
written once against the file structure below regardless of which side
consumes it. See the validation architecture doc for how each side wires
up and enforces it end to end.

**API side:** wrap the contract schema in a DTO via `createZodDto`, and use
the DTO — not the schema directly — in the controller signature:

```ts
export class CreatePostDto extends createZodDto(CreatePostSchema) {}
```

**Web side:** pass the contract schema directly to `useForm`, typed against
the schema's `Payload` (`z.input<>`) type — not the post-parse `z.infer<>`
type, since `useForm` is validating raw, pre-parse form state:

```ts
const formProps = useForm<CreatePostPayload>(createPostAsync, CreatePostSchema);
```

**Three files per feature: `primitives`, `entity`, `contracts`.** The
parent folder is named after the domain model (see File naming), and each
file is named `<feature>.<kind>.ts` — e.g.
`postComment/postComment.primitives.ts`, `postComment.entity.ts`,
`postComment.contracts.ts`.

### Primitives

Raw validators (`_title`, `_slug`, …) hold only value-shape rules — no
presence modifiers. A primitive says what a valid value _looks like_
(string, trimmed, max 200 chars); it never says whether the field is
required, optional, or nullable. That's decided downstream, once, by
whichever of entity or contracts is consuming it:

```ts
// posts.primitives.ts
export const _title = z.string().trim().min(1).max(200);
export const _slug = z.string().regex(/^[a-z0-9-]+$/);
```

### Entity

Mirrors the Prisma model exactly. Never exposed directly as an API
contract — it's the internal shape data takes on the way out of the DB.
Composes raw validators with `.nullish()` / `.default()`, matching however
the column itself is actually nullable/defaulted in the schema. Fields the
DB stores as a native type (like `Date`) stay that native type here —
transformation into a wire-format (ISO strings, etc.) is a contract
concern, not an entity one:

```ts
// posts.entity.ts
export const PostEntitySchema = z.object({
  title: _title,
  slug: _slug,
  publishedAt: z.date().nullish(),
  createdAt: z.date(),
});
```

### Contracts

Input/contract schemas compose the **same raw validators** with
`.optional()` (+ `emptyToUndefined` preprocessing where forms are
involved) — never derived from the entity's nullish fields. This is the
rule that used to be phrased as "never `.refine()` a field shared with a
Response schema" — it still holds, but the primitives/entity/contracts
split now makes it structural rather than something to remember: a
contract schema is built fresh from primitives, so refining a field for
input validation (e.g. "title must be non-empty on create") can never leak
into the entity or its response schema, because they were never composed
from the same refined definition in the first place.

Response contracts are also where any entity→wire transformation happens
(e.g. `Date` → ISO string) — that's a contract-only concern, never
something the entity schema itself does.

- Use `z.input<>` for anything **pre-parse** — form values, request bodies
  you're about to validate.
- Use `z.infer<>` only for **post-parse** data.

```ts
// posts.contracts.ts
export const CreatePostSchema = z.object({
  title: _title,
  category: optionalStringField(_category),
});

export type CreatePostPayload = z.input<typeof CreatePostSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;

export const PostResponseSchema = PostEntitySchema.extend({
  publishedAt: responseTimestamp.nullish(),
  createdAt: responseTimestamp,
});
```

**Naming: `<Action><Entity>Payload` vs `<Action><Entity>`.** `Payload` is
the pre-parse shape (what a form actually hands you — strings, empty
values, all the mess); the bare name is what the service receives after
`.parse()`/`.safeParse()` has run. Keeping both named and exported means a
form component can type against `CreatePostPayload` while the service
signature types against `CreatePost`, without either side quietly assuming
the other's shape.

### Helpers

All shared preprocessing/codec helpers are **contract-only** — they live
alongside `contracts`, never `primitives` or `entity`. Primitives are
intentionally bare (value-shape only), and entity fields use only the
standard `.nullish()`/`.default()` modifiers to mirror Prisma — neither
layer faces a form or a wire format, so neither has a reason to need a
helper. A helper exists specifically to bridge the entity's internal shape
to what a form sends or a client receives, which makes it a contract
concern by definition, not an exception to note per-helper.

At time of writing:

- **`optionalStringField(schema)`** — wraps a raw validator so that, absent
  an explicit default, `undefined` resolves to an empty string rather than
  staying `undefined`. Used for form fields that should render as blank
  rather than uncontrolled:

```ts
  category: optionalStringField(_category),
```

- **`responseTimestamp`** — a codec converting an inner `Date` to an ISO
  timestamp string on the way out (and back). Used bare for a required
  timestamp, `.nullish()` for one that can be absent:

```ts
  publishedAt: responseTimestamp.nullish(),
  createdAt: responseTimestamp,
```

## React Components

Arrow functions only — same rule as the general Functions convention, no
exception for components:

```tsx
// ✅
const PostCard = ({ title, excerpt }: PostCardProps) => { ... };

// ❌
function PostCard({ title, excerpt }: PostCardProps) { ... }
```

**No `React.FC`.** It used to be the default here, but it earns nothing
over a plain arrow function typed via its props — it doesn't do anything
`PropsWithChildren` doesn't already do more explicitly, and it makes the
return type looser than it needs to be. Type the props directly instead:

```tsx
// ✅
const PostCard = ({ title }: PostCardProps) => { ... };

// ❌
const PostCard: FC<PostCardProps> = ({ title }) => { ... };
```

**Props: `type` by default, `interface` only where it earns it.** Union
props (`type Variant = "primary" | "secondary"`), mapped/utility-type props,
and anything using `Omit`/`Pick` compose more naturally as `type`.
`interface` only pulls its weight where its specific capabilities are
needed — chiefly declaration merging, or an interface that's meant to be
extended by consumers outside this file. If a component uses `interface`,
leave a one-line comment naming which capability it needed, so a later pass
doesn't "clean it up" back to `type` and quietly lose the reason:

```tsx
// interface: consumers extend this when wrapping the button
export interface ButtonProps extends PropsWithChildren<
  ComponentProps<'button'>
> {
  variant?: 'primary' | 'secondary';
}
```

**Naming: `ComponentNameProps`.** `PostCard` → `PostCardProps`. Inline prop
typing is acceptable only for simple components with **two or fewer
props** — past that, name and hoist the type:

```tsx
// ✅ inline — two props, simple
const Avatar = ({ src, alt }: { src: string; alt: string }) => { ... };

// ✅ named — three+ props
type PostCardProps = {
  title: string;
  excerpt: string;
  publishedAt: Date;
};
const PostCard = ({ title, excerpt, publishedAt }: PostCardProps) => { ... };
```

**Prefer React's built-in prop helpers over hand-rolling the same shape.**
They stay in sync with React's own types across upgrades, which a
hand-written equivalent won't:

- `PropsWithChildren<T>` — instead of adding `children: ReactNode` by hand.
- `ComponentProps<"button">` / `ComponentProps<typeof SomeComponent>` — to
  inherit every prop a native element or existing component already
  accepts, rather than re-declaring the subset you think you need.
- `ComponentPropsWithoutRef<"input">` — same as above, but for a component
  that doesn't forward its ref through; pairs with `forwardRef`.
- `ComponentPropsWithRef<"input">` — same, when the ref _is_ forwarded.
- `ElementRef<"input">` — the ref type a native element exposes, for typing
  the `forwardRef` generic itself.

```tsx
// ✅ — inherits every native <button> prop, adds children, adds one custom prop
type ButtonProps = PropsWithChildren<ComponentProps<'button'>> & {
  variant?: 'primary' | 'secondary';
};

// ❌ — reinvents a subset of what ComponentProps<"button"> already gives you
type ButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
};
```

**`export default` when the file exports exactly one component** — always
at the bottom of the file, not inline on the declaration. This isn't
optional: a single-export file must use `export default`, so nothing
implicitly is a candidate for import as a name that could drift from the
component's own name.

When a file exports **more than one** component (e.g. a component plus a
small subcomponent it composes), there's no fixed rule on which becomes the
default — use judgment. If one is clearly the file's main export, `export
default` on that one (still at the bottom) plus inline `export const` for
the rest is fine. If they're peers with no clear "main," inline `export
const` for all of them is clearer — the "bottom only" placement rule
applies to `export default` specifically, not to named exports.

```tsx
// ✅ — single component, must be default, at the bottom
const PostCard = ({ title }: PostCardProps) => { ... };

export default PostCard;

// ✅ — multiple exports, one clearly primary — named export stays inline
export const PostCardSkeleton = () => { ... };

const PostCard = ({ title }: PostCardProps) => { ... };

export default PostCard;

// ✅ — multiple exports, no clear primary — all named, all inline
export const PostHeader = ({ title }: PostHeaderProps) => { ... };
export const PostFooter = ({ author }: PostFooterProps) => { ... };
```

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
