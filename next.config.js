/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  images: {
    domains: ['images.unsplash.com', 'tailwindui.com'],
  },
  // Suprimir advertencias de React durante el desarrollo
  reactStrictMode: false,
  // Evitar refreshes completos cuando hay cambios
  swcMinify: true,
  // Deshabilitar etags para evitar problemas de cache
  generateEtags: false,
  // typescript: {
  //   ignoreBuildErrors: true,
  // }
}

// Suprimir warnings en consola durante el desarrollo
if (process.env.NODE_ENV !== 'production') {
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('auto-scroll') || 
       args[0].includes('position: sticky') || 
       args[0].includes('position: fixed'))
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };
}

module.exports = nextConfig 