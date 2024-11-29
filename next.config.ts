import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/f/*`
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    },
    staleTimes: {
      dynamic: 60
    }
  }
};

export default nextConfig;
