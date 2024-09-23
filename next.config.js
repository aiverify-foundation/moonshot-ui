/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      const originalEntry = config.entry
      config.entry = async () => {
        const entries = await originalEntry()
        if (entries['main.js'] && !entries['main.js'].includes('./client/dev/webpack-hot-middleware-client')) {
          entries['main.js'].unshift('./client/dev/webpack-hot-middleware-client')
        }
        return entries
      }
    }
    return config
  },
}

module.exports = nextConfig
