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
                '@icon-gray': "#6b7280",
                '@border-gray': "#ced4da",
                '@star': "#fb923c",
                '@text-theme-disabled': "#7f7f7f"
            }
        }
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                nord: {
                    ...require("daisyui/src/theming/themes")["nord"],
                    secondary: "#ebcb8b",
                    warning: "#ebcb8b",
                    info: "#81a1c1",
                    success: "#52b788"
                },
            },
        ],
    },
};
