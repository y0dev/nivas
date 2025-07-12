import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // enable class-based dark mode
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // scan your source files
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',           // e.g. blue-600
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#6B7280',           // e.g. gray-500
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#DC2626',           // red-600
          foreground: '#FFFFFF',
        },
        background: '#FFFFFF',
        foreground: '#000000',
        accent: '#E0F2FE',
        muted: '#F3F4F6',
        ring: '#3B82F6',
        border: '#E5E7EB',
      },
    },
  },
  plugins: [],
}

export default config
