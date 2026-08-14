import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // ------------------------------------------------------------
    // To hit local backend, use the localhost URL (FastAPI default)
    // Remember to run `uvicorn main:app --reload` in your backend folder!
    // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    // Once deployed changes are live, switch back to:
    const apiUrl = 'https://typeform-api-vk-dad5apf6fvbbaehs.centralindia-01.azurewebsites.net/api';
    // ------------------------------------------------------------

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
