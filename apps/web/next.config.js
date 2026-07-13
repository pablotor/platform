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
  transpilePackages: ['@repo/contracts', '@repo/ui'],
  output: 'standalone',
};

export default nextConfig;
