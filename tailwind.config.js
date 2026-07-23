/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'arch-cream': '#FAF9F6',
        'arch-walnut': '#2C1E16',
        'arch-oak': '#8B5A2B',
      },
      boxShadow: {
        'arch-ambient': '0 20px 50px rgba(44,30,22,0.08)',
        'arch-glow': '0 0 30px rgba(44,30,22,0.1)',
      }
    },
  },
  plugins: [],
}

