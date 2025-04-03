import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "company-id", value: ":company-id" }],
      },
    ];
  },
};

export default nextConfig;
