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
import { TVHero } from '../components/TVHero'


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
      <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center">

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 py-20 lg:py-0">

          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left max-w-xl"
          >
            <h1 className="font-montserrat text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase leading-none tracking-tighter text-white">
              KAHANI
            </h1>

            <div className="mt-6">
              <p className="font-raleway text-2xl sm:text-3xl md:text-4xl font-light text-white/90 tracking-wide">
                Discover Your Next
              </p>
              <p className="font-raleway text-xl sm:text-2xl md:text-3xl font-light text-white/60 tracking-wide mt-1">
                Show <span className="text-white/40">/</span> Movie <span className="text-white/40">/</span> Book
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10"
            >
              <Link
                to="/dashboard"
                className="inline-block bg-white text-black font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-sm transition-all duration-300 hover:bg-red-600 hover:text-white"
              >
                Start Exploring
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - TV */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 w-full max-w-lg lg:max-w-xl"
          >
            <TVHero />
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
                  className="feature-card rounded-2xl border border-red-500/20 bg-neutral-900/50 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-red-500/20"
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
