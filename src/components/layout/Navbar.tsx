import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export const Navbar = () => {
  const { isAuthenticated, signOut } = useAuth()

  return (
    <nav className="fixed z-50 w-full bg-black/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/icon.png" alt="Kahani" className="h-12 w-12" />
              <span className="text-2xl font-bold text-white">Kahani</span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:space-x-8">
            <a
              href="#features"
              className="px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#trending"
              className="px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Trending
            </a>
            <a
              href="#how-it-works"
              className="px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              How It Works
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={signOut}
                className="px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
