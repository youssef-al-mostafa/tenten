import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],
    theme: {
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
    },
    plugins: [forms, require('daisyui')],
    daisyui: {
        themes: ['light'],
        darkTheme: 'light',
    },
};
