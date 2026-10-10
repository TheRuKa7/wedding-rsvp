import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Serve the animated wedding e-vite (public/invite/index.html) at the site root.
      beforeFiles: [
        { source: "/", destination: "/invite/index.html" },
        { source: "/invite", destination: "/invite/index.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
