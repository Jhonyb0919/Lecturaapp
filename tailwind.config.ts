import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17324d",
        sky: "#2f80ed",
        gold: "#f7b731",
        leaf: "#20bf6b",
        berry: "#8854d0",
        coral: "#fa8231",
        paper: "#fff9ec",
      },
      boxShadow: {
        playful: "0 18px 45px rgba(23, 50, 77, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
