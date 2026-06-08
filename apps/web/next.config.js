/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['http://localhost:3000'],
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
};

export default nextConfig;
