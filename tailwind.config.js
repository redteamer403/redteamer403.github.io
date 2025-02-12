/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: "#0ff", // Cyber theme neon blue
        darkBg: "#0a0a0a",
        accent: "#ff0077", // Cyber pink
      },
    },
  },
  plugins: [],
};
