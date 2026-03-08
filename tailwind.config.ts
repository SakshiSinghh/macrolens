import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        bg: {
          page: "#080C14",
          card: "#0F1623",
          elevated: "#161D2E",
        },
        border: {
          DEFAULT: "#1E2A3B",
        },
        // Text
        text: {
          primary: "#E8EDF5",
          secondary: "#7A8FA6",
          muted: "#4A5A6E",
        },
        // Accents
        accent: {
          cyan: "#00C2FF",
          blue: "#2D7DD2",
          amber: "#F5A623",
        },
        // Risk levels
        risk: {
          low: "#22C55E",
          moderate: "#EAB308",
          elevated: "#F97316",
          high: "#EF4444",
          critical: "#9B1C1C",
        },
        // Trend
        trend: {
          up: "#22C55E",
          down: "#EF4444",
          stable: "#7A8FA6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", "14px"],
        xs: ["11px", "16px"],
        sm: ["12px", "18px"],
        base: ["13px", "20px"],
        md: ["14px", "20px"],
        lg: ["16px", "24px"],
        xl: ["18px", "28px"],
        "2xl": ["20px", "28px"],
        "3xl": ["24px", "32px"],
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
