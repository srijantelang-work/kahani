import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { useAuth } from './hooks/useAuth'
import { SearchProvider } from './contexts/SearchContext'

// Import your page components here
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/Profile'
import { Settings } from './pages/Settings'
import { SignIn } from './pages/SignIn'
import { Movies } from './pages/Movies'
import { Books } from './pages/Books'
import { TVShowDetail } from './pages/TVShowDetail'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}

export const App = () => {
  const { isAuthenticated } = useAuth()

  return (
    <SearchProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/movies"
            element={
              <Layout>
                <ProtectedRoute>
                  <Movies />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/tv/:id"
            element={
              <Layout>
                <ProtectedRoute>
                  <TVShowDetail />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/books"
            element={
              <Layout>
                <ProtectedRoute>
                  <Books />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SearchProvider>
  )
}
