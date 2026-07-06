import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import Pages from 'vite-plugin-pages'
// https://vite.dev/config/
export default defineConfig({
	plugins: [
		Pages({
			dirs: 'src/pages',
			resolver: 'react',
		}),
		react(),
		tailwindcss(),
		tsconfigPaths({ projects: ['./tsconfig.app.json'] }),
	]
})
