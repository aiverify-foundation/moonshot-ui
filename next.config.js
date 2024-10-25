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
}

module.exports = nextConfig
