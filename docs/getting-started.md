# Getting Started

#### Prerequisites:

- [Node 22+](https://github.com/nvm-sh/nvm)
- [Yarn 1.22](https://classic.yarnpkg.com/en/docs/install)
- [Docker & Docker Compose](https://docs.docker.com/compose/install/)

### Setup

##### Environmental variables

```bash
# generate env files from examples
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local

# generate and fill in a secure AUTH_SECRET
# note: run this only once — re-running against an already-filled AUTH_SECRET
# will prepend a new value instead of replacing it
sed -i.bak "s|AUTH_SECRET=|AUTH_SECRET=$(openssl rand -base64 32)|" \
  apps/api/.env.local && rm apps/api/.env.local.bak
```

##### Dependencies and infrastructure

```bash
# install dependencies
yarn

# bring up local infrastructure
yarn infra:dev:up
```

##### Database

```bash
# apply database migrations
yarn workspace ptp-api migrate:dev

# generate the Prisma client
yarn workspace ptp-api prisma:generate
```

### Run

```bash
yarn dev
```
