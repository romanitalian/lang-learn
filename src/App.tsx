import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { registerSW } from 'virtual:pwa-register'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Lesson from './pages/Lesson'
import Review from './pages/Review'
import Dictionary from './pages/Dictionary'
import Settings from './pages/Settings'
import Statistics from './pages/Statistics'
import Onboarding from './pages/Onboarding'
import LevelTest from './pages/LevelTest'

function App() {
  useEffect(() => {
    // Register service worker for PWA
    registerSW({
      onNeedRefresh() {
        console.log('New content available, please refresh.')
      },
      onOfflineReady() {
        console.log('App is ready to work offline.')
      },
    })
  }, [])

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/level-test" element={<LevelTest />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="lesson" element={<Lesson />} />
              <Route path="review" element={<Review />} />
              <Route path="dictionary" element={<Dictionary />} />
              <Route path="settings" element={<Settings />} />
              <Route path="statistics" element={<Statistics />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App

