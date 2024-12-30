/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "selector",
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                '@theme-dark': "#202020",
                '@theme-ligth': "#e9ecef",
                '@white': '#fff',
                '@text-theme-dark': "#e9ecef",
                '@text-theme-white': "#595959",

                txt_white: "#fff",
                txt_dark: '#d20000',
                txt_disable: '#6c6c6c',
                bg_card: "#343434",
                border_dark: "#424242",

                highlight: "#ef4c53",
                star: "#fb923c",
                icon_gray: "#6b7280",
            }
        }
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                nord: {
                    ...require("daisyui/src/theming/themes")["nord"],
                    // accent: "#81a1c1",
                    secondary: "#ebcb8b",
                    warning: "#d08670",
                    info: "#81a1c1",
                    success: "#52b788"
                },
            },
        ],
    },
};
