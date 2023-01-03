import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import terser from '@rollup/plugin-terser';

const appConfig = {
	root: 'demo',
	server: {
		open: 'index.html',
	},
};

export default defineConfig(({ mode }) => {
	if (mode === 'app') {
		return { ...appConfig, plugins: [vue()] };
	}
	return {
		...appConfig,
		build: {
			outDir: '../dist',
			emptyOutDir: true,
			minify: 'terser',
			lib: {
				entry: '../src/useActiveTarget.ts',
				name: 'VueReactiveTOC',
				fileName: 'index',
			},
			rollupOptions: {
				external: ['vue'],
				output: {
					globals: {
						vue: 'Vue',
					},
				},
				plugins: [
					terser({
						compress: {
							defaults: true,
							drop_console: true,
						},
					}),
				],
			},
		},
		plugins: [
			vue(),
			dts({
				root: '../',
				include: ['src/useActiveTarget.ts'],
				beforeWriteFile: (_, content) => ({
					filePath: 'dist/index.d.ts',
					content,
				}),
			}),
		],
	};
});
