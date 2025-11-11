import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$components: path.resolve('./src/components')
		}
	},
	server: {
		host: '0.0.0.0', // Allow access from network
		port: 5173,
		strictPort: false
	}
});
