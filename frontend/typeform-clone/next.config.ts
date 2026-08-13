import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Always use the deployed Azure backend
    const apiUrl = 'https://typeform-api-vk-dad5apf6fvbbaehs.centralindia-01.azurewebsites.net/api';

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
