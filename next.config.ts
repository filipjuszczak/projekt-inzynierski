import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/f/*`
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
        pathname: `/f/*`
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    }
  }
};

export default nextConfig;
