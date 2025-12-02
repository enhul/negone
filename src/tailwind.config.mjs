/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ["0.75rem", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "300" }],
                sm: ["0.875rem", { lineHeight: "1.25", letterSpacing: "0.05em", fontWeight: "300" }],
                base: ["1rem", { lineHeight: "1.5", letterSpacing: "0.05em", fontWeight: "300" }],
                lg: ["1.125rem", { lineHeight: "1.75", letterSpacing: "0.05em", fontWeight: "300" }],
                xl: ["1.25rem", { lineHeight: "1.75", letterSpacing: "0.05em", fontWeight: "400" }],
                "2xl": ["1.5rem", { lineHeight: "2", letterSpacing: "0.05em", fontWeight: "400" }],
                "3xl": ["1.875rem", { lineHeight: "2.25", letterSpacing: "0.05em", fontWeight: "400" }],
                "4xl": ["2.25rem", { lineHeight: "2.5", letterSpacing: "0.05em", fontWeight: "400" }],
                "5xl": ["3rem", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "500" }],
                "6xl": ["3.75rem", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "500" }],
                "7xl": ["4.5rem", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "500" }],
                "8xl": ["6rem", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "500" }],
                "9xl": ["8rem", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "500" }],
            },
            fontFamily: {
                heading: ["cormorantgaramond"],
                paragraph: ["lato-light"]
            },
            colors: {
                primary: "#FCE4EC",
                "primary-foreground": "#212121",
                secondary: "#E1BEE7",
                "secondary-foreground": "#212121",
                background: "#FFFFFF",
                "soft-light-green": "#DCEDC8",
                destructive: "#F44336",
                "destructive-foreground": "#FFFFFF",
                foreground: "#424242",
                footerbackground: "#424242",
                linkcolor: "#212121",
                buttonborder: "#E1BEE7",
                darktext: "#424242",
                contentblockbackground: "#FFFFFF"
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
