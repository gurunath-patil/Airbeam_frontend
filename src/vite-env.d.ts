/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

declare module '~react-pages' {
	import type { RouteObject } from 'react-router-dom'
	const routes: RouteObject[]
	export default routes
}
