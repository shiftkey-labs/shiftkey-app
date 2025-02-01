const colors = require("./constants/Colors").default;

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: colors.light.primary,
        secondary: colors.light.secondary,
        accent: colors.light.accent,
        background: colors.light.background,
        text: colors.light.text,
        white: colors.light.white,
        black: colors.light.black,
        gray: colors.light.gray,
        lightGray: colors.light.lightGray,
        dark: {
          primary: colors.dark.primary,
          secondary: colors.dark.secondary,
          accent: colors.dark.accent,
          background: colors.dark.background,
          text: colors.dark.text,
          gray: colors.dark.gray,
          lightGray: colors.dark.lightGray,
        },
      },
      fontFamily: {
        sans: ["OpenSans", "sans-serif"],
        poppins: ["PoppinsRegular", "sans-serif"],
        poppinsBold: ["PoppinsBold", "sans-serif"],
        poppinsMedium: ["PoppinsMedium", "sans-serif"],
        spaceMono: ["SpaceMono", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px rgba(0, 0, 0, 0.25)",
        "3xl": "0 35px 60px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
