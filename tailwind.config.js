/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        washi: {
          50: '#fffcfa',
          100: '#fdf6f3',
          200: '#faeae4',
          300: '#f3d8cf',
        },
        crimson: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#e85366',
          600: '#d43c50',
          700: '#b52b3f',
          800: '#7f1d2c',
          900: '#4a121b',
        },
        gold: {
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#e5b869',
          500: '#c99746',
          600: '#a6762c',
        },
        ink: {
          DEFAULT: '#3b1d22',
          muted: '#7a545b',
          light: '#a47d84',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        jp: ['"Noto Serif JP"', 'serif'],
        display: ['"Playfair Display"', '"Noto Serif JP"', 'serif'],
      },
      boxShadow: {
        'washi': '0 10px 30px -8px rgba(181, 43, 63, 0.10), 0 2px 8px -2px rgba(181, 43, 63, 0.06)',
        'washi-hover': '0 18px 36px -10px rgba(212, 60, 80, 0.22), 0 4px 12px -2px rgba(212, 60, 80, 0.12)',
        'coral-glow': '0 8px 25px rgba(232, 83, 102, 0.35)',
        'gold-soft': '0 8px 24px rgba(201, 151, 70, 0.3)',
      },
      animation: {
        'spin-slow': 'spin 28s linear infinite',
        'spin-reverse-slow': 'spinReverse 32s linear infinite',
        'marquee': 'marquee 28s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'shake': 'shake 0.55s cubic-bezier(.36,.07,.19,.97) both',
        'stick-eject': 'stickEject 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'float-up': 'floatUp 3s ease-out infinite',
        'twinkle': 'starTwinkle 2.5s ease-in-out infinite',
        'bounce-note': 'bounceNote 1.1s ease-in-out infinite',
        'gradient-shift': 'gradientShift 6s ease-in-out infinite alternate',
      },
      keyframes: {
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-3px, 0, 0) rotate(-5deg)' },
          '20%, 80%': { transform: 'translate3d(4px, 0, 0) rotate(6deg)' },
          '30%, 50%, 70%': { transform: 'translate3d(-6px, 0, 0) rotate(-7deg)' },
          '40%, 60%': { transform: 'translate3d(6px, 0, 0) rotate(6deg)' },
        },
        stickEject: {
          '0%': { transform: 'translateY(10px) scaleY(0.5)', opacity: '0' },
          '40%': { opacity: '1' },
          '100%': { transform: 'translateY(-95px) scaleY(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(232, 83, 102, 0.3), 0 0 30px rgba(232, 83, 102, 0.1)' },
          '50%': { boxShadow: '0 0 25px rgba(232, 83, 102, 0.55), 0 0 50px rgba(232, 83, 102, 0.25)' },
        },
        floatUp: {
          '0%':   { transform: 'translateY(0) opacity(0)', opacity: '0' },
          '20%':  { opacity: '1' },
          '100%': { transform: 'translateY(-60px)', opacity: '0' },
        },
        starTwinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        bounceNote: {
          '0%, 100%': { transform: 'translateY(0) rotate(-15deg) scale(1)', opacity: '0.9' },
          '50%': { transform: 'translateY(-5px) rotate(5deg) scale(1.2)', opacity: '1' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
