import { useEffect, useState } from 'react'
import { MediaItem, tmdb } from '../services/tmdb'

export const TrendingSection = () => {
  const [trending, setTrending] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      const data = await tmdb.getTrending()
      setTrending(data)
      setIsLoading(false)
    }

    fetchTrending()
  }, [])

  return (
    <div id="trending" className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-4xl font-bold uppercase tracking-wider text-red-600">
            TRENDING NOW
          </h2>
          <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-white sm:text-4xl">
            Popular Movies & TV Shows
          </p>
        </div>

        <div className="mt-20">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] rounded-lg bg-gray-800"></div>
                  <div className="mt-4 h-4 w-3/4 rounded bg-gray-800"></div>
                  <div className="mt-2 h-4 w-1/2 rounded bg-gray-800"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
              {trending.slice(0, 8).map(item => (
                <div key={item.id} className="group relative">
                  <div className="aspect-[2/3] overflow-hidden rounded-lg">
                    <img
                      src={tmdb.getImageUrl(item.poster_path)}
                      alt={item.media_type === 'movie' ? item.title : item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-white">
                      {item.media_type === 'movie' ? item.title : item.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {item.media_type === 'movie'
                        ? new Date(item.release_date).getFullYear()
                        : new Date(item.first_air_date).getFullYear()}
                      {' · '}
                      <span className="text-yellow-400">★</span>{' '}
                      {item.vote_average.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
