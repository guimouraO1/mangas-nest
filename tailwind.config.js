/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                primary: "#516f95",
                txt_white: "#f3f3f3",
                txt_dark: '#2e3440',
                bg_dark: "#202020",
                bg_white: "#e9ecef",
                bg_card: "#1c1c1c",
                sun: "#f3f3f3",
                moon: "#f3f3f3",
                success: "#52b788",
                error: "#d00000",
                highlight: "#ef4c53",
                star: "#fb923c"
            },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: ["nord"],
      },
};
