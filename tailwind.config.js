/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // KATH Premium Gold & Black Theme
        kath: {
          // Primary Gold (Luxury & Premium)
          primary: '#AE8E1C',
          primaryDark: '#8B7316',
          primaryLight: '#C9A82F',
          primaryMuted: '#D4B84A',
          // Accent Gold variations
          gold: '#AE8E1C',
          goldDark: '#8B7316',
          goldLight: '#C9A82F',
          goldMuted: '#E8D89A',
          // Backgrounds (Cream Theme)
          bgMain: '#E6DDC5',
          bgCard: '#FFFFFF',
          bgSection: '#F5F0E0',
          bgDark: '#1A1A1A',
          bgDarker: '#0D0D0D',
          // Text (Dark for cream background)
          textPrimary: '#1A1A1A',
          textSecondary: '#4A4A4A',
          textMuted: '#6A6A6A',
          textLight: '#FFFFFF',
          // Semantic
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
          // Legacy (for backward compatibility)
          black: '#1A1A1A',
          darkGray: '#2A2A2A',
          charcoal: '#3A3A3A',
          mediumGray: '#6A6A6A',
          lightGray: '#E5E5E5',
          offWhite: '#FAFAFA',
          white: '#FFFFFF',
        },
        // CIBC Competition Theme (Dark)
        cibc: {
          // Primary Gold
          primary: '#AE8E1C',
          primaryDark: '#8B7316',
          primaryLight: '#C9A82F',
          primaryMuted: '#D4B84A',
          // Accent variations
          accent: '#AE8E1C',
          accentDark: '#8B7316',
          accentLight: '#C9A82F',
          // Backgrounds (Dark Theme)
          bgMain: '#0D0D0D',
          bgCard: '#1A1A1A',
          bgSection: '#2A2A2A',
          bgLight: '#1A1A1A',
          // Text (Light for dark background)
          textPrimary: '#FFFFFF',
          textSecondary: '#A0A0A0',
          textMuted: '#6A6A6A',
          textDark: '#1A1A1A',
          // Borders
          border: '#3A3A3A',
          borderLight: '#2A2A2A',
          // Semantic
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 10vw, 12rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'headline': ['clamp(1.75rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'subheadline': ['clamp(1rem, 2.5vw, 2rem)', { lineHeight: '1.3' }],
        'premium-xs': ['clamp(0.75rem, 1.5vw, 0.875rem)', { lineHeight: '1.5' }],
        'premium-sm': ['clamp(0.875rem, 2vw, 1rem)', { lineHeight: '1.5' }],
        'premium-base': ['clamp(1rem, 2.5vw, 1.125rem)', { lineHeight: '1.6' }],
        'premium-lg': ['clamp(1.125rem, 3vw, 1.5rem)', { lineHeight: '1.4' }],
        'premium-xl': ['clamp(1.5rem, 5vw, 2.5rem)', { lineHeight: '1.2' }],
        'premium-2xl': ['clamp(2rem, 8vw, 4rem)', { lineHeight: '1.1' }],
        'premium-3xl': ['clamp(2.5rem, 10vw, 6rem)', { lineHeight: '0.95' }],
      },
      borderRadius: {
        '4xl': '2.5rem',
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'soft': '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        'deep': '0 35px 60px -15px rgba(0, 0, 0, 0.2)',
        'gold': '0 0 40px rgba(174, 142, 28, 0.3)',
        'gold-lg': '0 0 60px rgba(174, 142, 28, 0.4)',
        'gold-sm': '0 0 20px rgba(174, 142, 28, 0.2)',
        'premium': '0 25px 50px -12px rgba(26, 26, 26, 0.15)',
        'card': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #AE8E1C 0%, #C9A82F 50%, #AE8E1C 100%)',
        'gold-gradient-light': 'linear-gradient(135deg, #C9A82F 0%, #D4B84A 50%, #C9A82F 100%)',
        'dark-gradient': 'linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(174, 142, 28, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(174, 142, 28, 0.6)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gold-shimmer": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "fade-in": "fade-in 0.8s ease-out forwards",
        "scale-in": "scale-in 2s ease-out forwards",
        "spin-slow": "spin-slow 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "gold-shimmer": "gold-shimmer 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'premium': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
