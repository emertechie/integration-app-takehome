import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.integration.app",
        pathname: "/connectors/**",
      },
    ],
  },
};

export default nextConfig;
