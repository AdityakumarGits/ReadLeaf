/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {
    colors: {
      roseleaf: "#FFCED8",
      blush: "#FFDDDD",
      cream: "#FFF4DE",
      peach: "#FFE8C4",
      ink: "#352B31",
      muted: "#85757C"
    },
    boxShadow: { soft: "0 12px 36px rgba(85, 48, 64, 0.08)" }
  }},
  plugins: []
};
