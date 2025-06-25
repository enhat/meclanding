/** @type {import('next').NextConfig} */
const nextConfig = {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.squarespace-cdn.com',
    },
  ],
};

module.exports = nextConfig;
