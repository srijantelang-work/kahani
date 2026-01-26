import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import {
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import logoImage from '../../assets/icon.png'
import clsx from 'clsx'

interface NavigationItem {
  name: string
  path: string
  requiresAuth: boolean
}

const navigation: NavigationItem[] = [
  {
    name: 'Recommendations',
    path: '/dashboard',
    requiresAuth: true,
  },
  {
    name: 'History',
    path: '/history',
    requiresAuth: true,
  },
  {
    name: 'Movies',
    path: '/movies',
    requiresAuth: true,
  },
  {
    name: 'TV Shows',
    path: '/tv',
    requiresAuth: true,
  },
  {
    name: 'Books',
    path: '/books',
    requiresAuth: true,
  },
  {
    name: 'Movie Bingo',
    path: '/movie-bingo',
    requiresAuth: true,
  },
  {
    name: 'TV Show Bingo',
    path: '/tv-bingo',
    requiresAuth: true,
  },
  {
    name: 'Profile',
    path: '/profile',
    requiresAuth: true,
  },
]

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const location = useLocation()
  const { user, signOut } = useAuthStore()

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 h-20 border-b border-white/5 bg-[#0a0a0a] px-6 transition-all duration-300">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-3">
            <div className="relative">
              <img
                src={logoImage}
                alt="Kahani"
                className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="font-montserrat text-2xl font-bold tracking-[0.2em] text-white transition-colors duration-300 group-hover:text-red-500">
              KAHANI
            </span>
          </Link>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsOpen(true)}
            className="group flex flex-col items-end justify-center space-y-1.5 p-2 transition-all hover:opacity-80 focus:outline-none"
            aria-label="Menu"
          >
            <span className="block text-sm font-light tracking-widest text-white/50 group-hover:text-white transition-colors uppercase">MENU</span>
            <div className="w-8 h-[1px] bg-white group-hover:w-10 transition-all duration-300"></div>
            <div className="w-5 h-[1px] bg-white group-hover:w-10 transition-all duration-300 delay-75"></div>
          </button>
        </div>
      </nav>

      {/* Side Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[70] h-full w-full max-w-md border-l border-white/10 bg-[#0a0a0a] shadow-2xl overflow-y-auto"
            >
              <div className="flex min-h-full flex-col p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="font-montserrat text-xl font-bold tracking-[0.2em] text-white/50 uppercase">
                    Navigation
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="group rounded-full border border-white/10 p-2 transition-colors hover:border-white/30 hover:bg-white/5"
                  >
                    <XMarkIcon className="h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-90" />
                  </button>
                </div>

                {/* Links */}
                <div className="mt-16 flex flex-col space-y-6">
                  {navigation
                    .filter(item => !item.requiresAuth || user)
                    .map((link, index) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={clsx(
                          "group flex items-center space-x-4 text-2xl font-light transition-all hover:pl-4",
                          isActive(link.path) ? "text-red-500 pl-4" : "text-white hover:text-red-500"
                        )}
                      >
                        <span className={clsx(
                          "text-xs font-bold transition-opacity duration-300",
                          isActive(link.path) ? "text-red-500 opacity-100" : "text-red-500 opacity-0 group-hover:opacity-100"
                        )}>
                          0{index + 1}
                        </span>
                        <span>{link.name}</span>
                      </Link>
                    ))}
                </div>

                {/* Authentication - Bottom Section */}
                <div className="mt-auto pt-16 border-t border-white/5">
                  {user ? (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 px-2">
                        {user.photoURL ? (
                          <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10">
                            <img
                              src={user.photoURL}
                              alt={user.displayName || 'User'}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                            <span className="text-white/50 text-sm font-bold uppercase transition-colors group-hover:text-red-500">
                              {(user.displayName || user.email || 'U').charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-white font-medium truncate">{user.displayName}</span>
                          <span className="text-white/30 text-xs truncate">{user.email}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full rounded-sm border border-red-900/30 bg-red-900/10 py-4 text-center text-sm font-bold uppercase tracking-widest text-red-500 transition-colors hover:bg-red-900/20"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Link
                        to="/login"
                        className="block w-full rounded-sm border border-white/10 bg-white/5 py-4 text-center text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
                      >
                        Login
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block w-full rounded-sm bg-red-600 py-4 text-center text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-700"
                      >
                        Get Started
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-red-800 bg-red-900/20 p-4 backdrop-blur-md">
          <div className="flex items-center justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-red-200">
              You are currently offline
            </span>
          </div>
        </div>
      )}
    </>
  )
}
