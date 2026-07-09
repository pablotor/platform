import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import path from 'path';

const ENV_FILE = path.join(__dirname, '.e2e-db-env.json');

const globalSetup = async () => {
  const container = await new PostgreSqlContainer('postgres:16-alpine')
    .withUsername('test')
    .withPassword('test')
    .withDatabase('test_db')
    .start();

  const dbEnv = {
    POSTGRES_USER: 'test',
    POSTGRES_PASSWORD: 'test',
    POSTGRES_DB: 'test_db',
    DB_HOST: container.getHost(),
    DB_PORT: String(container.getMappedPort(5432)),
    DB_SCHEMA: 'public',
  };

  const databaseUrl = `postgresql://${dbEnv.POSTGRES_USER}:${dbEnv.POSTGRES_PASSWORD}@${dbEnv.DB_HOST}:${dbEnv.DB_PORT}/${dbEnv.POSTGRES_DB}?schema=${dbEnv.DB_SCHEMA}`;

  (globalThis as any).__PG_CONTAINER__ = container;

  // Test files run in a separate Jest context from globalSetup and can't see
  // process.env set here — persist to disk and reload via setupFiles instead.
  writeFileSync(ENV_FILE, JSON.stringify(dbEnv));

  execSync(`npx prisma db push --url "${databaseUrl}"`, {
    env: { ...process.env, ...dbEnv },
    stdio: 'inherit',
  });
};

export default globalSetup;
