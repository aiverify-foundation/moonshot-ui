/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  async rewrites() {
    if (process.env.NEXT_PUBLIC_BASE_PATH) {
      return [
        {
          source: `${process.env.NEXT_PUBLIC_BASE_PATH}/api/:path*`,
          destination: `/api/:path*`,
        },
      ];
    } else {
      // Return an empty array if rewrites are not enabled
      return [];
    }
  },
}

module.exports = nextConfig
