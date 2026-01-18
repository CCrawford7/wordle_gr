import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles Next.js natively, no static export needed
  // This enables API routes for leaderboard

  // Trailing slash for clean URLs
  trailingSlash: false,
};

export default nextConfig;
