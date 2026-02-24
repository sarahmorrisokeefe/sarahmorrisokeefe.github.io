import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#5E6C5B',
          light: '#849680',
        },
        cream: {
          DEFAULT: '#FEFCF6',
          alt: '#F4EFE6',
        },
        ink: {
          DEFAULT: '#686867',
          dark: '#162a2c',
          darker: '#0f1e20',
        },
      },
      fontFamily: {
        serif: ['Lora', ...defaultTheme.fontFamily.serif],
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.ink.DEFAULT'),
            'h1,h2,h3,h4': {
              color: theme('colors.ink.dark'),
              fontFamily: theme('fontFamily.serif').join(', '),
            },
            a: { color: theme('colors.sage.DEFAULT') },
            'a:hover': { color: theme('colors.ink.dark') },
          },
        },
        invert: {
          css: {
            color: theme('colors.cream.DEFAULT'),
            'h1,h2,h3,h4': { color: theme('colors.cream.DEFAULT') },
            a: { color: theme('colors.sage.light') },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
