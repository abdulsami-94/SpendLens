import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["DM Serif Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        // Neutral Colors
        white: "var(--white)",
        off: "var(--off)",
        stone: "var(--stone)",
        mid: "var(--mid)",
        ink: "var(--ink)",
        
        // Accent Colors
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        
        // Semantic Colors
        warn: "var(--warn)",
        green: "var(--green)",
        
        // Status Colors
        "status-pending": "var(--status-pending)",
        "status-pending-text": "var(--status-pending-text)",
        "status-progress": "var(--status-progress)",
        "status-progress-text": "var(--status-progress-text)",
        "status-resolved": "var(--status-resolved)",
        "status-resolved-text": "var(--status-resolved-text)",
        
        // Semantic Backgrounds
        "error-bg": "var(--error-bg)",
        "error-text": "var(--error-text)",
        "success-bg": "var(--success-bg)",
        "success-text": "var(--success-text)",
        "info-bg": "var(--info-bg)",
        "info-text": "var(--info-text)",
        "warning-bg": "var(--warning-bg)",
        "warning-text": "var(--warning-text)",
        
        // Feature Icon Backgrounds
        "icon-orange": "var(--icon-orange)",
        "icon-green": "var(--icon-green)",
        "icon-purple": "var(--icon-purple)",
        "icon-red": "var(--icon-red)",
      },
      fontSize: {
        h1: ["clamp(1.8rem, 4vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h2: ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        h3: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        h4: ["1rem", { lineHeight: "1.4" }],
        h5: ["0.9rem", { lineHeight: "1.4" }],
        h6: ["0.8rem", { lineHeight: "1.5" }],
        body: ["0.95rem", { lineHeight: "1.6" }],
        sm: ["0.875rem", { lineHeight: "1.6" }],
        xs: ["0.8rem", { lineHeight: "1.5" }],
        micro: ["0.75rem", { lineHeight: "1.5" }],
        tiny: ["0.65rem", { lineHeight: "1.4" }],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
      },
      spacing: {
        "2xs": "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "40px",
        "4xl": "48px",
        "5xl": "60px",
        "6xl": "72px",
        "7xl": "80px",
        "8xl": "120px",
      },
      borderRadius: {
        pill: "100px",
        lg: "24px",
        base: "16px",
        md: "12px",
        sm: "10px",
        xs: "8px",
        micro: "4px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0, 0, 0, 0.15)",
        md: "0 4px 12px rgba(0, 0, 0, 0.2)",
        lg: "0 8px 32px rgba(0, 0, 0, 0.06)",
        xl: "0 24px 80px rgba(0, 0, 0, 0.1)",
        hover: "0 8px 24px rgba(0, 0, 0, 0.3)",
      },
      transitionDuration: {
        fast: "0.2s",
        normal: "0.3s",
        slow: "0.6s",
        slowest: "0.7s",
      },
      transitionTimingFunction: {
        ease: "ease",
        "ease-out": "ease-out",
        "ease-in-out": "ease-in-out",
      },
      maxWidth: {
        prose: "1200px",
        features: "1100px",
        flow: "900px",
        form: "700px",
      },
      zIndex: {
        base: "1",
        dropdown: "10",
        sticky: "20",
        fixed: "100",
        modal: "1000",
      },
    },
  },
  plugins: [],
};

export default config;
