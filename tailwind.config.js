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
