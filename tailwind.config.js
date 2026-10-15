/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        void: '#030305',
        obsidian: {
          950: '#060609',
          900: '#0b0c10',
          800: '#14161f',
          700: '#1d212f',
          600: '#2b3044',
        },
        ember: {
          400: '#ff7849',
          500: '#ff441f',
          600: '#e62e0b',
          glow: 'rgba(255, 68, 31, 0.45)',
        },
        bone: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e5ded1',
          300: '#cfc4b1',
        },
        chrome: {
          100: '#f8fafc',
          200: '#e2e8f0',
          400: '#94a3b8',
          600: '#475569',
        }
      },
      keyframes: {
        mawChomp: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(-18deg)' },
        },
        jawDrop: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(22deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        'maw-chomp': 'mawChomp 2.4s ease-in-out infinite',
        'jaw-drop': 'jawDrop 2.4s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'marquee': 'marquee 28s linear infinite',
      }
    },
  },
  plugins: [],
}

