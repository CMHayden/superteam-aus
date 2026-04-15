import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.lumacdn.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.lu.ma", pathname: "/**" },
      { protocol: "https", hostname: "luma.com", pathname: "/**" },
      { protocol: "https", hostname: "www.luma.com", pathname: "/**" },
      { protocol: "https", hostname: "i.pravatar.cc", pathname: "/**" },
    ],
  },
};

export default nextConfig;
