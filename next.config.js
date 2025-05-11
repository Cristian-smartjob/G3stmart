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

  // Suprimir advertencias de React durante el desarrollo
  reactStrictMode: false,
  // Deshabilitar etags para evitar problemas de cache
  generateEtags: false,
  // typescript: {
  //   ignoreBuildErrors: true,
  // }
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
      (args[0].includes("auto-scroll") || args[0].includes("position: sticky") || args[0].includes("position: fixed"))
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };
}

module.exports = nextConfig;
