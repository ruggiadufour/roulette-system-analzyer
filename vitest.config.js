import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
	test: {
		environment: 'jsdom',
		include: [
			// Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
			'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
		],
		globals: true
	},
	plugins: [svelte({ hot: !process.env.VITEST })]
});
