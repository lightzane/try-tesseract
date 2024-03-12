import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        // https://en.wikipedia.org/wiki/Dracula_(color_scheme)
        dracula: {
          darker: 'hsl(231 15% 18%)',
          dark: 'hsl(232 14% 31%)',
          light: 'hsl(60 30% 96%)',
          blue: 'hsl(225 27% 51%)',
          cyan: 'hsl(191 97% 77%)',
          green: 'hsl(135 94% 65%)',
          orange: 'hsl(31 100% 71%)',
          pink: 'hsl(326 100% 74%)',
          purple: 'hsl(265 89% 78%)',
          red: 'hsl(0 100% 67%)',
          yellow: 'hsl(65 92% 76%)',
        },
      },
      animation: {
        enter: 'enter .5s ease-in-out .8s forwards',
        'spin-slow': 'spin 5s linear infinite'
      },
      keyframes: {
        enter: {
          from: {
            opacity: 0,
            filter: 'blur(12px)',
            transform: 'translateY(1.25rem)',
          },
          to: {
            opacity: 1,
            filter: 'blur(0)',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
