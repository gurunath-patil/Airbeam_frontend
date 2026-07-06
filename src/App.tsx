import { Suspense } from 'react'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'
import routes from '~react-pages'

function AppRoutes() {
	return useRoutes(routes)
}
function App() {
	document.body.style.backgroundColor = '#f8f8f8'
	return (
		<Router>
			<Suspense fallback={<div>Loading page...</div>}>
				<AppRoutes />
			</Suspense>
		</Router>
	)
}

export default App
