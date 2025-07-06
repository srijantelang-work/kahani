import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePersonalizedRecommendation } from '../hooks/usePersonalizedRecommendation'
import { tmdb } from '../services/tmdb'
import { useAuth } from '../hooks/useAuth'

export const PersonalizedHeroMovie = () => {
  const { movie, matchPercentage, isLoading } = usePersonalizedRecommendation()
  const { user } = useAuth()
  const [selectedPoster, setSelectedPoster] = useState<number | null>(null)
  const [isFanned, setIsFanned] = useState(false)

  // Default posters arrangement (similar to original hero section)
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
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
      <div className="relative h-full w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          {isLoading ? (
            // Loading skeleton
            <div className="relative mt-16 h-[350px] w-[250px] animate-pulse rounded-lg bg-gray-800 sm:h-[400px] sm:w-[300px] md:h-[450px] md:w-[325px] lg:h-[500px] lg:w-[350px]" />
          ) : movie ? (
            // Personalized movie recommendation
            <div className="relative mt-16 h-[350px] w-[250px] sm:h-[400px] sm:w-[300px] md:h-[450px] md:w-[325px] lg:h-[500px] lg:w-[350px]">
              <Link
                to={`/movie/${movie.id}`}
                className="group absolute left-1/2 top-1/2 aspect-[2/3] w-full -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ease-out"
              >
                <img
                  src={tmdb.getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="h-full w-full rounded-lg object-cover shadow-xl transition-shadow duration-500"
                />

                {/* Match indicator */}
                <div className="absolute bottom-4 left-0 right-0 mx-auto flex w-[90%] items-center justify-center rounded-md bg-black bg-opacity-70 p-2">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-bold text-white">
                    {matchPercentage}% Match for{' '}
                    {user ? 'You' : 'Viewers Like You'}
                  </span>
                </div>
              </Link>

              {/* Movie details on hover */}
              <div className="absolute bottom-[-50px] left-0 right-0 flex justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">
                    {movie.title}
                  </h2>
                  <p className="text-sm text-gray-300">
                    {new Date(movie.release_date).getFullYear()} •{' '}
                    {movie.genres
                      ?.slice(0, 2)
                      .map(g => g.name)
                      .join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Fallback to original posters if no recommendation
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
                    zIndex: selectedPoster === poster.id ? 30 : 20 - poster.id,
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
          )}
        </div>
      </div>
    </div>
  )
}
