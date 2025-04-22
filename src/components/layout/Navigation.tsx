import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import {
  HomeIcon,
  UserCircleIcon,
  BookmarkIcon,
  Cog8ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface NavigationItem {
  name: string
  path: string
  icon: typeof HomeIcon
  requiresAuth: boolean
}

const navigation: NavigationItem[] = [
  { name: 'Home', path: '/', icon: HomeIcon, requiresAuth: true },
  {
    name: 'Profile',
    path: '/profile',
    icon: UserCircleIcon,
    requiresAuth: true,
  },
  { name: 'Lists', path: '/lists', icon: BookmarkIcon, requiresAuth: true },
  {
    name: 'Settings',
    path: '/settings',
    icon: Cog8ToothIcon,
    requiresAuth: true,
  },
]

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()

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
      navigate('/login')
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
      {/* Desktop Navigation */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-primary">Kahani</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation
                .filter(item => !item.requiresAuth || user)
                .map(item => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-gray-100 text-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${
                        isActive(item.path)
                          ? 'text-primary'
                          : 'text-gray-400 group-hover:text-primary'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
            </nav>
          </div>
          {user && (
            <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
              <button
                onClick={handleSignOut}
                className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary"
              >
                <ArrowLeftOnRectangleIcon
                  className="mr-3 h-6 w-6 text-gray-400 group-hover:text-primary"
                  aria-hidden="true"
                />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="fixed inset-x-0 top-0 z-40 bg-white shadow">
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className="text-xl font-bold text-primary">Kahani</h1>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75" />
        )}

        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-xl font-bold text-primary">Kahani</h1>
              </div>
              <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                {navigation
                  .filter(item => !item.requiresAuth || user)
                  .map(item => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group flex items-center rounded-md px-2 py-2 text-base font-medium ${
                        isActive(item.path)
                          ? 'bg-gray-100 text-primary'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                      }`}
                    >
                      <item.icon
                        className={`mr-4 h-6 w-6 flex-shrink-0 ${
                          isActive(item.path)
                            ? 'text-primary'
                            : 'text-gray-400 group-hover:text-primary'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
              </nav>
            </div>
            {user && (
              <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="group flex w-full items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary"
                >
                  <ArrowLeftOnRectangleIcon
                    className="mr-4 h-6 w-6 text-gray-400 group-hover:text-primary"
                    aria-hidden="true"
                  />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-50 p-4">
          <div className="flex items-center justify-center">
            <span className="text-sm font-medium text-yellow-800">
              You are currently offline. Some features may be limited.
            </span>
          </div>
        </div>
      )}
    </>
  )
}
