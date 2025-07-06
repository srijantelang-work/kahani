import { useState, useEffect } from 'react'

interface LoadingMessagesProps {
  mediaType: 'movie' | 'tv' | 'book'
  className?: string
}

const LOADING_MESSAGES = {
  movie: [
    'Analyzing your movie preferences...',
    'Searching through thousands of films...',
    'Finding your perfect movie match...',
    'Curating cinematic recommendations...',
  ],
  tv: [
    'Exploring TV series databases...',
    'Analyzing your viewing patterns...',
    'Finding binge-worthy shows...',
    'Discovering your next obsession...',
  ],
  book: [
    'Scanning literary collections...',
    'Analyzing your reading preferences...',
    'Finding your next great read...',
    'Discovering literary gems...',
  ],
}

export const LoadingMessages = ({
  mediaType,
  className = '',
}: LoadingMessagesProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const messages = LOADING_MESSAGES[mediaType]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length)
    }, 2000) // Change message every 2 seconds

    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-6 ${className}`}
    >
      {/* Spinner */}
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-red-600/20"></div>
        </div>
      </div>

      {/* Dynamic Message */}
      <div className="text-center">
        <p
          key={currentMessageIndex}
          className="animate-pulse text-lg font-medium text-white transition-opacity duration-500"
        >
          {messages[currentMessageIndex]}
        </p>
        <p className="mt-2 text-sm text-gray-400">
          This may take a few moments...
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex space-x-2">
        {messages.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              index === currentMessageIndex ? 'bg-red-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
