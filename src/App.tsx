import { Suspense } from 'react'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import UsePeer from '@/context/usePeerContext'

function AppRoutes() {
  return useRoutes(routes)
}
function App() {
  document.body.style.backgroundColor = '#f8f8f8'
  return (
    <UsePeer>
      <Router>
        <Suspense fallback={<div>Loading page...</div>}>
          <AppRoutes />
        </Suspense>
      </Router>
    </UsePeer>
  )
}

export default App
