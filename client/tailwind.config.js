/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "variable-collection-hijau": "var(--variable-collection-hijau)",
        "variable-collection-kuning-muda":
          "var(--variable-collection-kuning-muda)",
        "variable-collection-kuning-tua":
          "var(--variable-collection-kuning-tua)",
      },
    },
  },
  plugins: [],
};
