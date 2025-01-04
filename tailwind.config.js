const colors = require("./constants/Colors").default.light;

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        background: colors.background,
        text: colors.text,
        white: colors.white,
        black: colors.black,
        gray: colors.gray,
        lightGray: colors.lightGray,
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
