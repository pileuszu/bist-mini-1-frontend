/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  allowedDevOrigins: ["192.168.5.3", "192.168.5.28", "192.168.5.50"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/api/**",
      },
    ],
  },
};

export default nextConfig;
