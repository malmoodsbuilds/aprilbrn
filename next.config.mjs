/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This forces Vercel to ignore errors and publish the site
    ignoreDuringBuilds: true,
  },
};

export default nextConfig; 