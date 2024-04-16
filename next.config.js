/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, '@/styles')],
  },
  images: {
    domains: ['media.licdn.com'],
  },
  // reactStrictMode: false, // -- react 18 useEffect hook runs twice in dev. To disable this turn off strict mode
};

module.exports = nextConfig
