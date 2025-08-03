import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from './components/layout/Layout'
import { useAuth } from './hooks/useAuth'
import { SearchProvider } from './contexts/SearchContext'
import { GeminiProvider } from './contexts/GeminiContext'

// Lazy load all page components for better performance
const Landing = lazy(() =>
  import('./pages/Landing').then(module => ({ default: module.Landing }))
)
const Profile = lazy(() =>
  import('./pages/Profile').then(module => ({ default: module.Profile }))
)
const Settings = lazy(() =>
  import('./pages/Settings').then(module => ({ default: module.Settings }))
)
const Login = lazy(() =>
  import('./pages/Login').then(module => ({ default: module.Login }))
)
const Movies = lazy(() =>
  import('./pages/Movies').then(module => ({ default: module.Movies }))
)
const Books = lazy(() =>
  import('./pages/Books').then(module => ({ default: module.Books }))
)
const TVShows = lazy(() =>
  import('./pages/TVShows').then(module => ({ default: module.TVShows }))
)
const TVShowDetail = lazy(() =>
  import('./pages/TVShowDetail').then(module => ({
    default: module.TVShowDetail,
  }))
)
const AuthCallback = lazy(() =>
  import('./pages/AuthCallback').then(module => ({
    default: module.AuthCallback,
  }))
)
const Promptpage = lazy(() =>
  import('./pages/Promptpage').then(module => ({ default: module.Promptpage }))
)
const MovieDetail = lazy(() =>
  import('./pages/MovieDetail').then(module => ({
    default: module.MovieDetail,
  }))
)
const PrivacyPolicy = lazy(() =>
  import('./pages/PrivacyPolicy').then(module => ({
    default: module.PrivacyPolicy,
  }))
)
const TermsOfService = lazy(() =>
  import('./pages/TermsOfService').then(module => ({
    default: module.TermsOfService,
  }))
)
const Lists = lazy(() =>
  import('./pages/Lists').then(module => ({ default: module.Lists }))
)
const BookDetails = lazy(() =>
  import('./pages/BookDetails').then(module => ({
    default: module.BookDetails,
  }))
)
const BookDetail = lazy(() =>
  import('./pages/BookDetail').then(module => ({ default: module.BookDetail }))
)
const History = lazy(() =>
  import('./pages/History').then(module => ({ default: module.History }))
)
const MovieBingo = lazy(() =>
  import('./pages/MovieBingo').then(module => ({ default: module.MovieBingo }))
)
const TVShowBingo = lazy(() =>
  import('./pages/TVShowBingo').then(module => ({
    default: module.TVShowBingo,
  }))
)

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-black">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  </div>
)

// Layout loading fallback for protected routes
const LayoutLoadingFallback = () => (
  <Layout>
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
        <p className="text-sm text-gray-400">Loading page...</p>
      </div>
    </div>
  </Layout>
)

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export const App = () => {
  const { isAuthenticated } = useAuth()

  return (
    <GeminiProvider
      apiKey={import.meta.env.VITE_GEMINI_API_KEY || ''}
      model="gemini-2.0-flash"
      temperature={0.7}
      maxOutputTokens={1024}
      retryAttempts={3}
      retryDelay={2000}
    >
      <SearchProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                {isAuthenticated ? <Navigate to="/landing" /> : <Landing />}
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/landing"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <Landing />
              </Suspense>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <Promptpage />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/history"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/movies"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <Movies />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <MovieDetail />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/tv"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <TVShows />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/tv/:id"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <TVShowDetail />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/books"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <Books />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/books/:id"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <BookDetails />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/book/:id"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <BookDetail />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/auth/callback"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <AuthCallback />
              </Suspense>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <PrivacyPolicy />
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/terms-of-service"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <TermsOfService />
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/lists"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <Lists />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/movie-bingo"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <MovieBingo />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/tv-bingo"
            element={
              <Suspense fallback={<LayoutLoadingFallback />}>
                <Layout>
                  <ProtectedRoute>
                    <TVShowBingo />
                  </ProtectedRoute>
                </Layout>
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SearchProvider>
    </GeminiProvider>
  )
}
