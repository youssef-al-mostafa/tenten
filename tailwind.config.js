import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],
    plugins: [
        forms,
        require('daisyui'),
    ],
    daisyui: {
        themes: ["light"], 
        darkTheme: "light",
    },
};
