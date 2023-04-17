/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.pug"],
  theme: {
    colors: {
      primary: "var(--color-cultured-gray)",
      secondary: "var(--color-secondary)",
      mac: "var(--color-mac-and-cheese)",
      "tc-primary": "var(--color-text)",
      main: {
        50: "#FEF5E7",
        100: "#FDECCE",
        200: "#FCE2B6",
        300: "#FBD89D",
        400: "#FBBF24",
        500: "#FACF85",
        600: "#F9C56D",
        700: "#F8BB54",
        800: "#F7B13C",
        900: "#F59E0B",
      },
      gray: {
        50: "#F0F0F0",
        100: "#E1E1E0",
        200: "#D1D1D1",
        300: "#C2C2C1",
        400: "#B3B3B2",
        500: "#A4A4A3",
        600: "#959593",
        700: "#858584",
      },
      white: "#FFFFFF",
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    fontFamily: {
      sans: ["Lato", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
