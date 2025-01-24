/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/socket.io/:path*",
        destination:
          "https://merrymatchsocket-production.up.railway.app/socket.io/:path*",
      },
    ];
  },
};

export default nextConfig;
