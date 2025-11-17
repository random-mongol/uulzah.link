/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  i18n: {
    locales: ['mn', 'en'],
    defaultLocale: 'mn',
  },
}

module.exports = nextConfig
