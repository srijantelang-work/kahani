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

const features = [
  {
    name: 'AI-Powered Discovery',
    description: 'Our advanced Gemini AI understands your unique taste to suggest your next favorite show, movie, or book with uncanny precision.',
  },
  {
    name: 'Unified Library',
    description: 'Explore a vast universe of entertainment. Seamlessly browse through millions of titles across movies, television, and literature in one place.',
  },
  {
    name: 'Smart Collections',
    description: 'Build your personal sanctuary of stories. Effortlessly organize, track, and revisit the tales that move you.',
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

      {/* Features Section - Cinematic Spotlight */}
      <div id="features" className="bg-black py-32 sm:py-48">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-32 sm:space-y-64">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Visual Glow */}
                <div className="absolute -inset-10 rounded-full bg-red-600/5 blur-3xl transition-opacity duration-700 group-hover:bg-red-600/10" />

                <span className="mb-4 font-montserrat text-sm font-bold uppercase tracking-[0.3em] text-red-600/60">
                  Step 0{index + 1}
                </span>

                <h2 className="relative font-montserrat text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white mb-8">
                  {feature.name}
                </h2>

                <p className="relative max-w-2xl font-raleway text-xl sm:text-2xl font-light leading-relaxed text-white/50 transition-colors duration-500 group-hover:text-white/80">
                  {feature.description}
                </p>

                {/* Vertical Line Connector */}
                {index !== features.length - 1 && (
                  <div className="absolute -bottom-48 left-1/2 h-24 w-[1px] -translate-x-1/2 bg-gradient-to-b from-red-600/30 to-transparent sm:h-32" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorks />

      <Footer />
    </div>
  )
}
