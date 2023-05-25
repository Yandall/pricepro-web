/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/:slug*",
        destination: `${process.env.API_HOST}:slug*`,
      },
    ];
  },
};

module.exports = nextConfig;
