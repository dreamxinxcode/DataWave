const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|calendar|image|input|navbar|select|slider|ripple|spinner|form|listbox|divider|popover|scroll-shadow).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
};
