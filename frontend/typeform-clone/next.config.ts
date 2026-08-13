import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const isProd = process.env.NODE_ENV === 'production';
    const apiUrl = isProd 
      ? 'https://typeform-api-vk-dad5apf6fvbbaehs.centralindia-01.azurewebsites.net/api'
      : 'http://127.0.0.1:8000/api';

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
