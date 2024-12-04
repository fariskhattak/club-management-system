import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cms_background: "#F9F9FB",
        cms_background_dark: "#2C2F36",
        cms_text_dark: "#333333",
        cms_text_light: "#FFFFFF",
        cms_border: "#C5C6D0",
        cms_purple: "#8884d8",
        cms_light_purple: "#B2AFEF",
        cms_dark_purple: "#5A56A5",
        cms_soft_teal: "#68B8C4",
        cms_golden_yellow: "#F1C75B",
        cms_soft_pink: "#D884B0",
        cms_accept: "#68C471", 
        cms_deny: "#E25C4D",  
      },
    },
  },
  plugins: [],
} satisfies Config;
