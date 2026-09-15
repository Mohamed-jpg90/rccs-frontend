/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // add your production API host here too when you deploy, e.g.:
      // { protocol: 'https', hostname: 'api.yourapp.com', pathname: '/uploads/**' },
    ],
  },
}

export default nextConfig