import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import logoImage from '../../assets/icon.png'

export const Navbar = () => {
  const { isAuthenticated, signOut } = useAuth()

  return (
    <nav className="fixed z-50 w-full border-b border-red-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logoImage} alt="Kahani" className="h-8 w-8" />
              <span className="text-2xl font-bold tracking-wider text-red-600">
                KAHANI
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:space-x-1">
            <a
              href="#features"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-red-900/50 hover:text-white"
            >
              Features
            </a>
            <a
              href="#trending"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-red-900/50 hover:text-white"
            >
              Trending
            </a>
            <a
              href="#how-it-works"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-red-900/50 hover:text-white"
            >
              How It Works
            </a>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <button
                onClick={signOut}
                className="group flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-red-900/50 hover:text-white"
              >
                <span>Sign Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-red-900/50 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/dashboard"
                  className="rounded-md bg-red-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-800"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
