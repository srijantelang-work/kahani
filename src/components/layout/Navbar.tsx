import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import logoImage from '../../assets/icon.png'

export const Navbar = () => {
  const { isAuthenticated, signOut } = useAuth()

  return (
    <nav className="glass-effect fixed z-50 w-full border-b border-red-800/30 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="group flex items-center space-x-3 transition-transform hover:scale-105"
            >
              <div className="relative">
                <div className="absolute -inset-1 animate-pulse rounded-full bg-red-600/20 blur-sm"></div>
                <img
                  src={logoImage}
                  alt="Kahani"
                  className="relative h-8 w-8"
                />
              </div>
              <span className="kahani-brand liquid-glass-text text-2xl font-black tracking-wider text-red-600">
                KAHANI
                <span className="shine-text red"></span>
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:space-x-2">
            <a
              href="#features"
              className="liquid-glass-button group relative rounded-lg px-4 py-2 text-sm font-bold text-gray-300 transition-all duration-300 before:bg-transparent hover:text-white hover:before:bg-red-900/50"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
              <span className="relative z-10">Features</span>
            </a>
            <a
              href="#trending"
              className="liquid-glass-button group relative rounded-lg px-4 py-2 text-sm font-bold text-gray-300 transition-all duration-300 before:bg-transparent hover:text-white hover:before:bg-red-900/50"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
              <span className="relative z-10">Trending</span>
            </a>
            <a
              href="#how-it-works"
              className="liquid-glass-button group relative rounded-lg px-4 py-2 text-sm font-bold text-gray-300 transition-all duration-300 before:bg-transparent hover:text-white hover:before:bg-red-900/50"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
              <span className="relative z-10">How It Works</span>
            </a>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <button
                onClick={signOut}
                className="liquid-glass-button group relative flex items-center space-x-2 rounded-lg border border-red-800/30 px-4 py-2 text-sm font-bold text-gray-300 transition-all duration-300 before:bg-transparent hover:border-red-800/50 hover:text-white hover:before:bg-red-900/50"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
                <span className="relative z-10">Sign Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="liquid-glass-button group relative rounded-lg border border-red-800/30 px-4 py-2 text-sm font-bold text-gray-300 transition-all duration-300 before:bg-transparent hover:border-red-800/50 hover:text-white hover:before:bg-red-900/50"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
                  <span className="relative z-10">Login</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="liquid-glass-button group relative rounded-lg bg-gradient-to-r from-red-600 to-red-800 px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:from-red-700 hover:to-red-900"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
                  <span className="relative z-10">Get Started</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
