/** @type {import('tailwindcss').Config} */

import tailwindcssPlugin from ".";

export default {
  content: ["./playground/index.html"],
  plugins: [tailwindcssPlugin()],
};
