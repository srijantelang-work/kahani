import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import logoImage from '../../assets/icon.png'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'

export const Navbar = () => {
  const { isAuthenticated, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Close drawer when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Trending', href: '#trending' },
    { name: 'How It Works', href: '#how-it-works' },
  ]

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

          {/* Hamburger Menu - Visible on all screens as requested */}
          <button
            onClick={() => setIsOpen(true)}
            className="group flex flex-col items-end justify-center space-y-1.5 p-2 transition-all hover:opacity-80 focus:outline-none"
            aria-label="Menu"
          >
            <span className="block text-sm font-light tracking-widest text-white/80 group-hover:text-white transition-colors">MENU</span>
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
              className="fixed right-0 top-0 z-[70] h-full w-full max-w-md border-l border-white/10 bg-[#0a0a0a] shadow-2xl"
            >
              <div className="flex h-full flex-col p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="font-montserrat text-xl font-bold tracking-[0.2em] text-white/50">
                    NAVIGATION
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="group rounded-full border border-white/10 p-2 transition-colors hover:border-white/30 hover:bg-white/5"
                  >
                    <XMarkIcon className="h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-90" />
                  </button>
                </div>

                {/* Links */}
                <div className="mt-20 flex flex-col space-y-8">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="group flex items-center space-x-4 text-3xl font-light text-white transition-all hover:pl-4 hover:text-red-500"
                    >
                      <span className="text-sm font-bold text-red-500 opacity-0 group-hover:opacity-100">
                        0{index + 1}
                      </span>
                      <span>{link.name}</span>
                    </motion.a>
                  ))}
                </div>

                {/* Authentication - Bottom Section */}
                <div className="mt-auto border-t border-white/10 pt-8">
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        signOut()
                        setIsOpen(false)
                      }}
                      className="w-full rounded-lg border border-red-900/30 bg-red-900/10 py-4 text-center font-medium text-red-500 transition-colors hover:bg-red-900/20"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="block w-full rounded-lg border border-white/10 bg-white/5 py-4 text-center font-medium text-white transition-colors hover:bg-white/10"
                      >
                        Login
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="block w-full rounded-lg bg-red-600 py-4 text-center font-medium text-white transition-colors hover:bg-red-700"
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
    </>
  )
}
