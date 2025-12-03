/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ["0.75rem", { lineHeight: "1.25", letterSpacing: "0.02em", fontWeight: "400" }],
                sm: ["0.875rem", { lineHeight: "1.35", letterSpacing: "0.02em", fontWeight: "400" }],
                base: ["1rem", { lineHeight: "1.5", letterSpacing: "0.025em", fontWeight: "400" }],
                lg: ["1.125rem", { lineHeight: "1.5", letterSpacing: "0.025em", fontWeight: "400" }],
                xl: ["1.25rem", { lineHeight: "1.5", letterSpacing: "0.02em", fontWeight: "600" }],
                "2xl": ["1.5rem", { lineHeight: "1.4", letterSpacing: "0.015em", fontWeight: "600" }],
                "3xl": ["1.875rem", { lineHeight: "1.3", letterSpacing: "0em", fontWeight: "700" }],
                "4xl": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
                "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "700" }],
                "6xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
                "7xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "800" }],
                "8xl": ["6rem", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "900" }],
                "9xl": ["8rem", { lineHeight: "1", letterSpacing: "-0.035em", fontWeight: "900" }],
            },
            fontFamily: {
                heading: ["bitter"],
                paragraph: ["madefor-display"]
            },
            colors: {
                primary: "#aed979",
                "primary-foreground": "#333333",
                secondary: "#f592ab",
                "secondary-foreground": "#333333",
                background: "#fff7fa",
                "soft-light-green": "#dfb8e9",
                destructive: "#DF3131",
                "destructive-foreground": "#FFFFFF",
                foreground: "#333333",
                footerbackground: "#333333",
                linkcolor: "#e1b9eb",
                buttonborder: "#B9D6E8",
                darktext: "#333333",
                contentblockbackground: "#fff8fb"
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
