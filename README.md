# PTP (PabloTor Platform)

An opinionated TypeScript platform architecture built from real-world consulting experience.

PTP is a monorepo starter focused on helping teams avoid common foundation mistakes when building modern web applications. It combines proven architectural patterns, production-ready defaults, and extensive documentation to provide a solid starting point for scalable products.

The goal is simple:

> Start with an architecture that can grow with your product instead of fighting it six months later.

---

## Why PTP?

After working on many startups, I noticed the same issues appearing repeatedly:

- Authentication implemented differently in every project
- Validation scattered throughout the application
- ORM models leaking into business logic
- Weak module boundaries
- Difficult-to-maintain frontend/backend contracts
- Infrastructure decisions that become expensive to change later

PTP exists to capture the patterns and decisions that consistently worked in production systems.

This is not a boilerplate marketplace.

This is not a low-code platform.

This is an opinionated foundation for TypeScript applications.

---

## Current Architecture

PTP is currently built on top of the official Turborepo + NestJS example and extends it into a production-oriented platform architecture. The original example demonstrates a Turborepo monorepo with a Next.js frontend, a NestJS backend, and shared packages.

### Applications

```text
apps/
├── web      # Next.js frontend
└── api      # NestJS backend
```

### Packages

```text
packages/
├── api      # Shared DTOs, entities, contracts
├── eslint-config
└── typescript-config
```

The shared package approach allows frontend and backend applications to use the same contracts and types while remaining independently deployable.

---

## Principles

PTP follows a small set of architectural principles:

### Explicit Boundaries

Frontend, backend, domain logic, and infrastructure concerns should be clearly separated.

### Type Safety

Types should flow across the entire stack whenever possible.

### Self-Hosted First

Applications should be able to run locally and in self-managed environments without depending on proprietary services.

### Documentation Matters

Understanding why a decision exists is often more valuable than the implementation itself.

### Sensible Defaults

Every default should have a reason.

---

## Getting Started

### Prerequisites

- Node.js 22+
- yarn
- Docker (recommended)

### Installation

```bash
git clone <repository-url>
cd ptp

yarn install
```

### Development

Run all applications:

```bash
yarn dev
```

This starts:

- Next.js frontend
- NestJS API
- Shared package watchers

### Build

```bash
yarn build
```

### Lint

```bash
yarn lint
```

### Type Check

```bash
yarn check-types
```

---

## Project Vision

PTP is being developed incrementally.

Planned areas include:

- Flexible database adapters
  - PostgreSQL + Prisma
  - MongoDB + Mongoose

- Authentication modules
  - BetterAuth
  - Keycloak

- Docker-first local environments

- Accessible UI components

- Shared validation strategies

- Architecture documentation

- Project bootstrap tooling

The goal is not to support every possible architecture.

The goal is to provide a curated set of well-documented options.

---

## Documentation

Documentation is a first-class part of the project.

Future documentation topics include:

- Architecture decisions
- Authentication strategies
- DTO design
- Validation patterns
- Monorepo organization
- API boundaries
- Database tradeoffs
- Deployment approaches

Each topic will focus not only on implementation but also on the reasoning behind the decision.

---

## Consulting

PTP is also available as a consulting engagement.

If your team needs:

- Architecture reviews
- Platform setup
- Monorepo migrations
- Authentication design
- TypeScript platform guidance

feel free to reach out through:

https://pablotor.dev

---

## Status

🚧 Early development

PTP is actively evolving. Expect architectural changes while the foundation is being established.

Feedback, discussions, and contributions are welcome.

---

## License

MIT
