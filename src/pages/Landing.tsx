import { Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import {
  BeakerIcon,
  FilmIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  WifiIcon,
} from '@heroicons/react/24/outline'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useAuth } from '../hooks/useAuth'
import { HowItWorks } from '../components/layout/HowItWorks'
import { motion } from 'framer-motion'

// Lazy load heavy components to improve initial page load
const TrendingSection = lazy(() =>
  import('../components/TrendingSection').then(module => ({
    default: module.TrendingSection,
  }))
)

// Loading fallback for trending section
const TrendingSectionFallback = () => (
  <div className="bg-black py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="lg:text-center">
        <h2 className="text-4xl font-bold uppercase tracking-wider text-red-600">
          TRENDING NOW
        </h2>
        <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-white sm:text-4xl">
          Popular Movies & TV Shows
        </p>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] rounded-lg bg-gray-800"></div>
            <div className="mt-4 h-4 w-3/4 rounded bg-gray-800"></div>
            <div className="mt-2 h-4 w-1/2 rounded bg-gray-800"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

interface Feature {
  name: string
  description: string
  icon: typeof BeakerIcon
}

const features: Feature[] = [
  {
    name: 'AI-Powered Discovery',
    description:
      'Powered by Gemini AI to understand your preferences and provide intelligent, context-aware recommendations across movies, TV shows, and books.',
    icon: BeakerIcon,
  },
  {
    name: 'Multi-Platform Content',
    description:
      'Seamlessly integrates content from TMDB and Google Books, giving you access to a vast library of movies, TV shows, and books all in one place.',
    icon: FilmIcon,
  },
  {
    name: 'Smart Search & Filters',
    description:
      'Advanced search with natural language processing and intelligent filters to help you find exactly what you want to watch or read.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Personalized Experience',
    description:
      'Create collections, track your history, and get recommendations tailored to your unique taste and viewing patterns.',
    icon: BookmarkIcon,
  },
  {
    name: 'Offline Access',
    description:
      'Progressive Web App with offline support, caching your favorite content and searches for uninterrupted access.',
    icon: WifiIcon,
  },
]

export const Landing = () => {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-montserrat text-6xl font-semibold tracking-tight text-red-600 sm:text-7xl md:text-8xl lg:text-9xl"
          >
            KAHANI
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-3xl"
          >
            <h2 className="font-raleway text-2xl font-thin tracking-wide text-white sm:text-3xl md:text-4xl">
              Discover Your Next Favorite Show or Movie or Book
            </h2>
            <p className="mt-4 text-base text-gray-300 sm:text-lg md:text-xl">
              Kahani uses AI to provide personalized recommendations based on
              your unique preferences and interests.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="liquid-glass-button relative flex items-center justify-center overflow-hidden rounded-md px-8 py-4 text-lg font-medium text-white transition-all duration-300 before:absolute before:inset-0 before:z-0 before:bg-gradient-to-r before:from-red-500/80 before:to-red-600/80 before:backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/25 hover:before:from-red-500/90 hover:before:to-red-600/90"
              >
                <span className="shine"></span>
                <span className="z-10">Go to Recommendations</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="liquid-glass-button relative flex items-center justify-center overflow-hidden rounded-md px-8 py-4 text-lg font-medium text-white transition-all duration-300 before:absolute before:inset-0 before:z-0 before:bg-gradient-to-r before:from-red-500/80 before:to-red-600/80 before:backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/25 hover:before:from-red-500/90 hover:before:to-red-600/90"
                >
                  <span className="shine"></span>
                  <span className="z-10 flex items-center">
                    <span className="mr-2 h-0.5 w-5 rounded bg-white/90"></span>
                    Get Started — It's Free
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center rounded-md border border-gray-600 bg-transparent px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-white/5"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Trending Section - Lazy Loaded */}
      <Suspense fallback={<TrendingSectionFallback />}>
        <TrendingSection />
      </Suspense>

      {/* Features Section */}
      <div
        id="features"
        className="relative overflow-hidden bg-neutral-900 py-24"
      >
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/5 to-black" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative inline-block font-montserrat text-2xl font-semibold uppercase tracking-wider text-red-600 sm:text-3xl"
            >
              <span className="relative z-10">Features</span>
              <div className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-red-600/80 to-transparent"></div>
            </motion.h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to discover your next favorite
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Explore a world of entertainment with our powerful features
              designed to enhance your discovery experience.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:max-w-none lg:grid-cols-3">
              {features.map(feature => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="feature-card rounded-2xl border border-red-500/20 bg-black/30 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-red-500/20"
                >
                  <div className="relative pl-16">
                    <dt className="text-base font-semibold leading-7">
                      <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-900">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
                        {feature.name}
                      </span>
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-300">
                      {feature.description}
                    </dd>
                  </div>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorks />

      <Footer />
    </div>
  )
}
