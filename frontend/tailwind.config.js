/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/App.vue',
    './src/views/**/*.{vue,js,ts,jsx,tsx}',
    './src/components/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}
