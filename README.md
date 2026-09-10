# PabloTor Platform

### _An elegant platform, for a more civilized age._

---

## What, why, and how?

As a founder engineer, I've worked with fullstack JS platforms for a while. And the truth is, I've never felt completely happy with any of them.

It's not that they were bad. But when building features is the most important part, building the platform itself suffers — sometimes in the form of poor UX, other times in the form of tech debt. I always thought that, if given the time, I could build something better.

This is when the idea of the **PabloTor Platform (PTP)** started. Its main goal is to get most of the things every platform needs done right, and through that, provide both users and developers the best experience. The basic concept is a general-purpose platform, like Django or AdonisJS, that, instead of creating its own framework, implements some of the most used ones in an opinionated way. This way, it works both as a foundation and as a recipe book.

## Getting started

**Prerequisites:** Node 22+, Yarn 1.22, Docker

```bash
# install dependencies
yarn

# copy environment files
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local

# generate and fill in a secure AUTH_SECRET
# note: run this only once — re-running against an already-filled AUTH_SECRET will prepend a new value instead of replacing it
sed -i.bak "s|AUTH_SECRET=|AUTH_SECRET=$(openssl rand -base64 32)|" apps/api/.env.local && rm apps/api/.env.local.bak
```

Then, to run the platform:

```bash
# bring up local infrastructure
yarn infra:dev:up

# apply database migrations and generate the Prisma client
yarn workspace ptp-api migrate:dev
yarn workspace ptp-api prisma:generate

# run the platform
yarn dev
```

## Philosophy

> Do not reinvent the wheel. Just make sure you're using it the right way.

You will find little original source code here, but many production-ready implementations of proven-track libraries and technologies, with their testing and documentation included.

My criteria while selecting them was roughly the following:

- **Open source and self-hosted.** No company locks. You're in control of the whole stack.
- **Proven track record.** There might be really good reasons to use that bleeding-edge new DB, but Postgres works just fine.
- **My own experience.** Libraries that served me well before, like Prisma or lodash, were an auto-default. Others that are usually standard but gave me issues in the past, like NestJS's `class-validator`, were replaced.

None of this is written in stone — it's a guideline, not a checklist. BetterAuth is a good example of that. I've worked with Auth0 and Cognito before, and both lock you into their platform, each with its own set of issues on top. While researching what to use for PTP, I came across BetterAuth and liked its approach enough to make the exception: a younger project, but self-hosted and actively maintained, which fits the platform's principles better than the proven-track alternatives did.

I also try to follow conventions as long as they aren't harmful to the developer experience. For example, I'm aware kebab-case is now the default file naming convention for React components. But it makes my life awful while looking for component sources, which I do a lot. The simplicity of doing so by name, imho, outweighs the annoyance of case changes while renaming files.

## Architecture

PTP is a **contract-centered, domain-separated platform, with a modular monolith API.**

- **Contracts are the starting point.** They allow a single definition of primitives, entities, and DTOs shared across the platform. They don't just reduce code duplication — they give you a single way to think about and implement new features, keeping the platform cohesive. Contracts stay framework-agnostic by design: no Nest, no Next, no React inside the contracts package. Just Zod.
- **Domain separation.** "The platform" today consists of the API and the web app. An admin panel with user management and web telemetry is on the roadmap.
- **Modular monolith API.** A monolith is the best architecture for almost any startup — it's simple, everyone knows it well, and it lets you grow the fastest. Built in a genuinely modular way, the transition to microservices later becomes an implementation detail rather than a rewrite.

## What is included?

- Shared ESLint, Jest, and TypeScript configs
- Contracts package (Zod, framework-agnostic)
- UI package
  - Shared theme
  - Shared UI components — user menu, toast, and more
- Web app ([Next.js](https://nextjs.org))
  - Sign up / sign in flows
  - Page security
  - State management
- API app ([NestJS](https://nestjs.com))
  - Authentication endpoints, powered by [BetterAuth](https://www.better-auth.com/)
  - PostgreSQL client with error handling
- Demo blogging feature
- Local development `docker-compose` setup
- Terraform deployment config (Vercel + Oracle Free Tier)

## What comes next?

- [ ] Bootstrap CLI — pick your package manager, auto-scaffold the platform
- [ ] CI/CD pipeline
- [ ] API email integration
- [ ] User reset password flow
- [ ] API S3 integration
- [ ] Document management
- [ ] Role-based access control (RBAC)

## A note on the deployment stack

The philosophy above is self-hosted, no lock-in. The reference deployment (Vercel for the web app, Oracle Free Tier for the API) isn't a contradiction of that so much as a bootstrapping constraint: running staging and production for the API inside the Oracle free tier's memory limits leaves little room to also host the web app there. The web app doesn't use any Vercel-specific APIs, so moving it off Vercel — onto that same box, or anywhere else — is a deployment change, not a rewrite.

## Support

If PTP saves you time, consider supporting its development.

- GitHub Sponsors: _coming soon_
- Buy Me a Coffee: _coming soon_

Available for consulting work on platform architecture, NestJS/Next.js implementations, and full-stack foundations — reach out via [GitHub](https://github.com/pablotor) or [email](mailto:me@pablotor.dev)

## License

[MIT](./LICENSE)
