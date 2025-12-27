import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone'
  /* config options here */
};

export default nextConfig;
module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
}