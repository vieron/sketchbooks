/** @type {import('tailwindcss').Config} */

// Docs: https://docs.astro.build/en/guides/integrations-guide/tailwind/#usage
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
