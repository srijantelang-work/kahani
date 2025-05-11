import { Link } from 'react-router-dom'
import {
  BeakerIcon,
  ChartBarIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterTextIcon,
  CogIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useState } from 'react'
import { TrendingSection } from '../components/TrendingSection'
import { useAuth } from '../hooks/useAuth'

interface Feature {
  name: string
  description: string
  icon: typeof BeakerIcon
}

const features: Feature[] = [
  {
    name: 'AI-Powered Discovery',
    description:
      'Uses advanced AI to understand your preferences and provide tailored recommendations.',
    icon: BeakerIcon,
  },
  {
    name: 'Trending Content',
    description: "Stay updated with what's popular right now.",
    icon: ChartBarIcon,
  },
  {
    name: 'Save Favorites',
    description:
      'Create your personal collection of favorite movies and shows for easy access.',
    icon: BookmarkIcon,
  },
]

const howItWorks = [
  {
    name: 'Describe What You Like',
    description:
      "Tell us what you're in the mood for using natural language, just like chatting with a friend.",
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    name: 'AI Analyzes Your Preferences',
    description:
      'Our AI understands your tastes and searches through thousands of titles to find perfect matches.',
    icon: CogIcon,
  },
  {
    name: 'Get Personalized Recommendations',
    description:
      "Receive curated suggestions that match exactly what you're looking for, with details on where to watch.",
    icon: StarIcon,
  },
]

export const Landing = () => {
  const { user } = useAuth()
  const [selectedPoster, setSelectedPoster] = useState<number | null>(null)
  const [isFanned, setIsFanned] = useState(false)

  const posters = [
    {
      id: 1,
      angle: isFanned ? -20 : -5,
      translateX: isFanned ? '-20%' : '-2%',
    },
    {
      id: 2,
      angle: 0,
      translateX: '0%',
    },
    {
      id: 3,
      angle: isFanned ? 20 : 5,
      translateX: isFanned ? '20%' : '2%',
    },
  ]

  const handlePosterClick = (id: number) => {
    if (selectedPoster === id) {
      setSelectedPoster(null)
      setIsFanned(false)
    } else {
      setSelectedPoster(id)
      setIsFanned(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 bg-black pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center sm:text-center lg:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                  <span className="block font-bold">Discover Your Next</span>{' '}
                  <span className="block text-red-600">
                    Favorite Show or Movie or Book
                  </span>
                </h1>
                <p className="mt-4 text-lg text-gray-300 sm:mt-6 sm:text-xl md:text-2xl lg:mx-0">
                  Kahani uses AI to provide personalized recommendations based
                  on your unique preferences and interests.
                </p>
                <div className="mt-8 flex flex-col space-y-3 sm:mt-10 sm:flex-row sm:space-x-4 sm:space-y-0">
                  {user ? (
                    <Link
                      to="/dashboard"
                      className="flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-red-700"
                    >
                      Go to Recommendations
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-red-700"
                      >
                        Get Started — It's Free
                      </Link>
                      <Link
                        to="/login"
                        className="flex items-center justify-center rounded-md border border-gray-600 bg-transparent px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/5"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative mt-16 h-[350px] w-[250px] sm:h-[400px] sm:w-[300px] md:h-[450px] md:w-[325px] lg:h-[500px] lg:w-[350px]">
                {posters.map(poster => (
                  <div
                    key={poster.id}
                    onClick={() => handlePosterClick(poster.id)}
                    className={`absolute left-1/2 top-1/2 aspect-[2/3] w-full cursor-pointer transition-all duration-500 ease-out
                      ${
                        selectedPoster === poster.id
                          ? 'z-30 scale-105'
                          : selectedPoster === null
                            ? 'hover:scale-102'
                            : 'scale-95 opacity-50'
                      }`}
                    style={{
                      transform: `translate(-50%, -50%) 
                        translateX(${poster.translateX})
                        rotate(${poster.angle}deg)
                        ${selectedPoster === poster.id ? 'translateZ(50px)' : ''}`,
                      zIndex:
                        selectedPoster === poster.id ? 30 : 20 - poster.id,
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <img
                      src={`/images/poster${poster.id}.jpg`}
                      alt={`Movie Poster ${poster.id}`}
                      className="h-full w-full rounded-lg object-cover shadow-xl transition-shadow duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <TrendingSection />

      {/* Features Section */}
      <div id="features" className="bg-neutral-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-4xl font-bold uppercase tracking-wider text-red-600">
              FEATURES
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-white sm:text-4xl">
              Powered by AI for Perfect Recommendations
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {features.map(feature => (
                <div key={feature.name} className="relative">
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-red-600 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg font-medium leading-6 text-white">
                    {feature.name}
                  </p>
                  <p className="ml-16 mt-2 text-base text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-4xl font-bold uppercase tracking-wider text-red-600">
              HOW IT WORKS
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-white sm:text-4xl">
              Three Simple Steps
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {howItWorks.map((step, index) => (
                <div key={step.name} className="relative">
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <p className="ml-16 text-lg font-medium leading-6 text-white">
                    {step.name}
                  </p>
                  <p className="ml-16 mt-2 text-base text-gray-300">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to Discover Your Next Favorite?</span>
            <span className="block text-red-100">
              Join thousands of users who have found their perfect match.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-red-600 hover:bg-red-50"
              >
                Get Started — It's Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
