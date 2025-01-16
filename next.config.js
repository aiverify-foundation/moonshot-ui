/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Powered-By',
            value: 'moonshot-next',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/datasets/file',
        destination: `${process.env.MOONSHOT_API_URL}/api/v1/datasets/file`,
      },
    ]
  },
}

module.exports = nextConfig
