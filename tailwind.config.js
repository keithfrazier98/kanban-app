/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
        width: "width",
        spacing: "margin, padding",
      },
      fontFamily: {
        jakarta: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: {
          indigo: {
            active: "#635FC7",
            inactive: "#A8A4FF",
          },
          gray: {
            100: "#FFFFFF",
            200: "#F4F7FD",
            300: "#E4EBFA",
            400: "#828FA3",
            500: "#3E3F4E",
            600: "#2B2C37",
            700: "#20212C",
            800: "#000112",
          },
          red: {
            active: "#EA5555",
            inactive: "#FF9898",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
