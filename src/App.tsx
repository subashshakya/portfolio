import { useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { TransitionProvider } from './components/Transition'
import { Home } from './pages/Home'
import { ProjectPage } from './pages/ProjectPage'

/** Jump (not scroll) on route change — the curtain hides the move. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useLayoutEffect(() => {
    const el = hash && document.getElementById(hash.slice(1))
    if (el) el.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <TransitionProvider>
      <ScrollManager />
      <div className="paper-grain page-grain" />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </TransitionProvider>
  )
}
