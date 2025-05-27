/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
    ],
  },

  // Configuración mejorada para evitar problemas de chunks
  experimental: {
    optimizePackageImports: ["@headlessui/react", "@heroicons/react"],
  },

  // Configuración de webpack para mejorar la carga de chunks
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10,
            chunks: "all",
          },
        },
      };
    }
    return config;
  },

  // Suprimir advertencias de React durante el desarrollo
  reactStrictMode: false,
  // Deshabilitar etags para evitar problemas de cache
  generateEtags: false,

  // Configuración de compilación
  swcMinify: true,

  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/people",
        permanent: false, // false = redirección temporal (307), true = permanente (308)
      },
    ];
  },
};

// Suprimir warnings en consola durante el desarrollo
if (process.env.NODE_ENV !== "production") {
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("auto-scroll") ||
        args[0].includes("position: sticky") ||
        args[0].includes("position: fixed") ||
        args[0].includes("ChunkLoadError"))
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };
}

module.exports = nextConfig;
