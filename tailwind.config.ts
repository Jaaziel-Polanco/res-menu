import type { Config } from "tailwindcss";
const { addDynamicIconSelectors } = require('@iconify/tailwind')

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        wave: 'wave 1.5s ease-in-out infinite',
        float: 'float 3s infinite'
    },
    keyframes: {
        spin: {
            '100%': { transform: 'rotate(360deg)' }
        },
        ping: {
            '75%, 100%': { transform: 'scale(2)', opacity: '0' }
        },
        wave: {
            '0%, 60%, 100%': { transform: 'translateY(0)' },
            '30%': { transform: 'translateY(-15px)' }
        },
        float: {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(180deg)' }
        }

      },
    },
   
  },
  plugins: [addDynamicIconSelectors(),
    require("tailwindcss-animated"),
  ],
} satisfies Config;
