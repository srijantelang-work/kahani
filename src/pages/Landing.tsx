import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChartBarIcon,
  LockClosedIcon,
  ArrowPathIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline'

interface Feature {
  name: string
  description: string
  icon: typeof ChartBarIcon
}

const features: Feature[] = [
  {
    name: 'Advanced Analytics',
    description: 'Get detailed insights into your reading habits and progress.',
    icon: ChartBarIcon,
  },
  {
    name: 'Secure Storage',
    description: 'Your stories and data are encrypted and safely stored.',
    icon: LockClosedIcon,
  },
  {
    name: 'Real-time Sync',
    description: 'Access your content seamlessly across all your devices.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Mobile Optimized',
    description: 'Enjoy a smooth reading experience on any device.',
    icon: DevicePhoneMobileIcon,
  },
]

const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="mb-4 h-8 w-3/4 rounded bg-gray-200"></div>
    <div className="mb-8 h-4 w-1/2 rounded bg-gray-200"></div>
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-4 rounded bg-gray-200"></div>
      ))}
    </div>
  </div>
)

export const Landing = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">
                      Your stories deserve
                    </span>{' '}
                    <span className="block text-indigo-600 xl:inline">
                      to be shared
                    </span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                    Create, share, and discover amazing stories. Join our
                    community of storytellers and readers today.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        to="/signin"
                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:px-10 md:py-4 md:text-lg"
                      >
                        Get Started
                      </Link>
                    </div>
                    <div className="mt-3 sm:ml-3 sm:mt-0">
                      <a
                        href="#features"
                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200 md:px-10 md:py-4 md:text-lg"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-indigo-500 to-purple-600 object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"></div>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <>
              <div className="lg:text-center">
                <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
                  Features
                </h2>
                <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
                  Everything you need to tell your story
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                  Our platform provides all the tools you need to create,
                  manage, and share your stories with the world.
                </p>
              </div>

              <div className="mt-10">
                <div className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
                  {features.map(feature => (
                    <div key={feature.name} className="relative">
                      <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                        {feature.name}
                      </p>
                      <p className="ml-16 mt-2 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
