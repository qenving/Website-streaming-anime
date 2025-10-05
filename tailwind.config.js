import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0b0b13",
        "midnight-700": "#121225",
        "midnight-500": "#1a1a33",
        "violet-neon": "#9d4edd",
        "cyan-neon": "#2dd4bf",
        accent: "#7c3aed",
        highlight: "#22d3ee",
        surface: "#1f1f3a",
        muted: "#6b7280",
      },
      fontFamily: {
        sans: ['"Poppins"', "Inter", "system-ui", "sans-serif"],
        heading: ['"Poppins"', "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 25px 80px rgba(124, 58, 237, 0.25)",
        neon: "0 0 35px rgba(45, 212, 191, 0.3)",
      },
      backgroundImage: {
        grainy: "radial-gradient(circle at 1px 1px, rgba(124, 58, 237, 0.17) 1px, transparent 0)",
        "hero-glow": "radial-gradient(circle at 10% 20%, rgba(124, 58, 237, 0.45), transparent 55%), radial-gradient(circle at 80% 0%, rgba(45, 212, 191, 0.35), transparent 60%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(-4px)" },
          "50%": { transform: "translateY(4px)" },
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2.5rem",
          xl: "3rem",
        },
      },
    },
  },
  plugins: [forms, typography],
};
