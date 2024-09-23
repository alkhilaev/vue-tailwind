/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "0 10px 60px 0 rgba(226, 236, 249, 0.5)",
      },
      borderRadius: {
        "4xl": "30px",
      },
      colors: {
        "white-100": "#FAFBFF",
        primary: "#5932EA",
      },
      screens: {
        mobile: { max: "640px" },
        tablet: { min: "641px", max: "1024px" },
        desktop: { min: "1025px" },
      },
    },
  },
  plugins: [],
};
