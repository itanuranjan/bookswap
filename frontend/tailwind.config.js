/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f4f6f7", // very light tint
          100: "#e3e7e9",
          200: "#c1c9cd",
          300: "#9ca8ad",
          400: "#6b7a81",
          500: "#1e313a", // Base color
          600: "#192930",
          700: "#141f25",
          800: "#0f181d",
          900: "#0a1013",
          950: "#304f61",
        },

        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#2F5061", // Dark grey: color(srgb 0.1828 0.3116 0.3791)
          800: "#1e293b",
          900: "#0f172a",
        },
         orange: {
          50:  "#fff4f2",
          100: "#ffe4de",
          200: "#ffc2b5",
          300: "#ff9e8a",
          400: "#f7705c",
          500: "#f35034", // your main color
          600: "#e14628",
          700: "#b83720",
          800: "#f35034",
          900: "#6e2013",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
