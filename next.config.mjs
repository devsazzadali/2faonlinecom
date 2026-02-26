/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: false, 
  // swcMinify: true, <-- Deleted this line
  images: {
    unoptimized: true,
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;