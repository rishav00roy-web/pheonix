/** @type {import('tailwindcss').Config} */
// Every colour and font resolves to the tokens declared at :root in src/index.css
const token = (name) => `rgb(var(--${name}-rgb) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // ── Shape lock: square corners; only dots and rings are round ─────────
    borderRadius: {
      'none': '0',
      'sm':   '0',
      DEFAULT:'0',
      'md':   '0',
      'lg':   '0',
      'xl':   '0',
      '2xl':  '0',
      '3xl':  '0',
      'full': '9999px',
      // The specimen card keeps the original site's soft corner
      'card': '12px',
    },
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)'],
        sans:  ['var(--font-body)'],
        mono:  ['var(--font-mono)'],
      },
      colors: {
        void: token('void'),
        obsidian: {
          950: token('obsidian-950'),
          900: token('obsidian-900'),
          800: token('obsidian-800'),
          700: token('obsidian-700'),
        },
        bone: {
          100: token('bone-100'),
          300: token('bone-300'),
        },
        ember: {
          400: token('ember-400'),
          500: token('ember-500'),
        },
        chrome: {
          400: token('chrome-400'),
        },
      },
    },
  },
  plugins: [],
}
