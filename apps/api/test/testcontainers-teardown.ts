import { existsSync, unlinkSync } from 'fs';
import path from 'path';

const ENV_FILE = path.join(__dirname, '.e2e-db-env.json');

const globalTeardown = async () => {
  const container = (globalThis as any).__PG_CONTAINER__;
  if (container) await container.stop();
  if (existsSync(ENV_FILE)) unlinkSync(ENV_FILE);
};

export default globalTeardown;
