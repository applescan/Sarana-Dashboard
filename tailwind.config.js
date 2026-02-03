/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-beam':
          'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(192,132,252,0.05))',
      },
      colors: {
        primary: '#818CF8',
        secondary: '#0B1224',
        accent: '#C084FC',
        surface: '#020617',
        card: '#0F172A',
        muted: '#94A3B8',
        'primary-foreground': '#EEF2FF',
        'secondary-foreground': '#E2E8F0',
        'glass-border': 'rgba(255,255,255,0.08)',
      },
      boxShadow: {
        glow: '0 20px 120px -20px rgba(99,102,241,0.45)',
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
