/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        oxford: "#0B132B",
        slateDark: "#0F172A",
        emerald: "#10B981",
        cyan: "#06B6D4",
        gold: "#D4AF37",
        platinum: "#F3F4F6"
      }
    }
  },
  plugins: []
};
