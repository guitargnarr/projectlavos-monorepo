/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // projectlavos neubrutalism palette
        'lavos-blue': '#1e40af',      // Primary: Trust
        'lavos-blue-light': '#3b82f6',
        'lavos-blue-dark': '#1e3a8a',
        'lavos-orange': '#f97316',    // Secondary: Warmth
        'lavos-orange-light': '#fb923c',
        'lavos-green': '#10b981',     // Accent: Growth
        'lavos-black': '#0a0a0a',     // Borders
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-sm': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-lg': '12px 12px 0px 0px rgba(0, 0, 0, 1)',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
    },
  },
  plugins: [],
}
