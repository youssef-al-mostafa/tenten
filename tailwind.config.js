import forms from '@tailwindcss/forms';

export default {
    darkMode: false,
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        darkMode: false,
        extend: {
            fontFamily: {
                oswald: ['Oswald', 'sans-serif'],
                satoshi: ['Satoshi', 'sans-serif'],
                integral_cf: ['Integral CF', 'sans-serif'],
            },
            width: {
                webkit: '-webkit-fill-available',
            },
            height: {
                webkit: '-webkit-fill-available',
            },
        },
        keyframes: {
            'scroll-infinite': {
                '0%': {
                    transform: 'translateX(0)',
                },
                '100%': {
                    transform: 'translateX(calc(-1 * (6rem + 200px) * 5))',
                },
            },
        },
        animation: {
            'scroll-slow': 'scroll-infinite 20s linear infinite',
            'scroll-medium': 'scroll-infinite 15s linear infinite',
            'scroll-fast': 'scroll-infinite 10s linear infinite',
        },
    },
    plugins: [
        forms,
        require('daisyui'),
    ],
    daisyui: {
        themes: ['light'],
        darkTheme: false,
        darkMode: false,
    },
};
