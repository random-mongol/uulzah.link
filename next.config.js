/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Note: i18n config is for Pages Router only, not compatible with App Router
  // We handle i18n in middleware.ts instead
}

module.exports = nextConfig
