import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  basePath: 'auth',
}) as ReturnType<typeof createAuthClient>;

export default authClient;
