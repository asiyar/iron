const { themeColors } = require("./theme.config.js");

const scheme = (token) => `var(--color-${token})`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./lib/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: Object.fromEntries(Object.keys(themeColors).map((token) => [token, scheme(token)])),
    },
  },
  plugins: [],
};
