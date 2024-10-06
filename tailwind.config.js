/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },
            colors: {
                primary: "#184e77",
                txt_white: "#cbcbcb",
                bg_dark: "#292929",
                bg_white: "#e9ecef",
                sun: "#e4e4e7",
                moon: "#292929",
                success: "#52b788",
                error: "#d00000",
            },
        },
    },
    plugins: [require("daisyui")],
};
