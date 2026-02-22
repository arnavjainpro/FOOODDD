/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
    // Allow locally-uploaded images in /public/uploads to be served unoptimized
    // (they are already in public/ so no remote pattern needed — next/image handles /uploads/* natively)
  },
}

export default nextConfig
