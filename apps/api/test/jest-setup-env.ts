import { readFileSync } from 'fs';
import path from 'path';

const ENV_FILE = path.join(__dirname, '.e2e-db-env.json');

const dbEnv = JSON.parse(readFileSync(ENV_FILE, 'utf-8'));

Object.assign(process.env, dbEnv);
