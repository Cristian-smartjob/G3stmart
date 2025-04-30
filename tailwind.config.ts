import type { Config } from "tailwindcss";
import flowbite from "flowbite/plugin";

export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#F99B06",
        secondary: "#29D9C2"
      },
    },
  },
  plugins: [
    flowbite,
  ],
} satisfies Config;
