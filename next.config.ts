import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      domains: ['res.cloudinary.com'],
    },  
    middleware: {
      '/api/:path*': ['middleware'], // Aplica el middleware a todas las rutas de API
    },
};

export default nextConfig;
