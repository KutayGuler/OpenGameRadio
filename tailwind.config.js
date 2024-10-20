const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				base: colors.neutral,
				primary: colors.emerald,
				secondary: colors.amber
			}
		}
	},
	plugins: []
};
