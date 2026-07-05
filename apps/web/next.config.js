/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/design',
        destination: '/design/fundamentals',
        permanent: true,
      },
    ];
  },
  allowedDevOrigins: ['http://localhost:3000'],
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
};

export default nextConfig;
