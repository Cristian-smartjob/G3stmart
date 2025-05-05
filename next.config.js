/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  // typescript: {
  //   ignoreBuildErrors: true,
  // }
}

module.exports = nextConfig 