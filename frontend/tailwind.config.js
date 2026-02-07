/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Custom color palette for BananaClock
                fresh: {
                    light: '#10b981',
                    DEFAULT: '#059669',
                    dark: '#047857',
                },
                ripe: {
                    light: '#fbbf24',
                    DEFAULT: '#f59e0b',
                    dark: '#d97706',
                },
                spoiled: {
                    light: '#f87171',
                    DEFAULT: '#ef4444',
                    dark: '#dc2626',
                },
                // Dark mode background colors
                dark: {
                    bg: '#0f0f0f',
                    card: '#1a1a1a',
                    panel: '#242424',
                    border: '#333333',
                },
                // Light mode background colors
                light: {
                    bg: '#f8f8f5',
                    card: '#ffffff',
                    panel: '#f0f0eb',
                    border: '#e5e5e0',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float': 'float 20s ease-in-out infinite',
                'float-delayed': 'float 25s ease-in-out infinite 5s',
                'float-slow': 'float 30s ease-in-out infinite 10s',
                'spin-slow': 'spin 20s linear infinite',
                'pulse-soft': 'pulse 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': {
                        transform: 'translateY(0) translateX(0) rotate(0deg)',
                        opacity: '0.1'
                    },
                    '25%': {
                        transform: 'translateY(-20px) translateX(10px) rotate(5deg)',
                        opacity: '0.15'
                    },
                    '50%': {
                        transform: 'translateY(-10px) translateX(-5px) rotate(-3deg)',
                        opacity: '0.1'
                    },
                    '75%': {
                        transform: 'translateY(-30px) translateX(15px) rotate(8deg)',
                        opacity: '0.12'
                    },
                }
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
                'soft-lg': '0 8px 40px rgba(0, 0, 0, 0.12)',
                'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
            }
        },
    },
    plugins: [],
}
