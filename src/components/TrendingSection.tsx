import { useEffect, useState } from 'react'
import { MediaItem, Movie, TVShow, tmdb } from '../services/tmdb'
import { MovieCard, MovieCardData } from './MovieCard'
import { TVShowCard } from './TVShowCard'
import { Link } from 'react-router-dom'

// Helper function to transform Movie to MovieCardData
const transformToMovieCard = (item: Movie): MovieCardData => ({
  id: item.id,
  title: item.title,
  overview: item.overview || '',
  poster_path: item.poster_path,
  release_date: item.release_date,
  vote_average: item.vote_average,
  vote_count: item.vote_count || 0,
  original_language: item.original_language || 'en',
})

// Helper function to transform TVShow to extended TVShow type
const transformToTVShow = (item: TVShow) => ({
  ...item,
  overview: item.overview || '',
  vote_count: item.vote_count || 0,
  original_language: item.original_language || 'en',
})

export const TrendingSection = () => {
  const [trending, setTrending] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await tmdb.getTrending()
        setTrending(data)
      } catch (error) {
        console.error('Error fetching trending items:', error)
      } finally {
        setIsLoading(false)
      }
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

        <div className="mt-12">
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
              {trending
                .slice(0, 8)
                .map(item =>
                  item.media_type === 'movie' ? (
                    <MovieCard
                      key={item.id}
                      movie={transformToMovieCard(item as Movie)}
                    />
                  ) : (
                    <TVShowCard
                      key={item.id}
                      show={transformToTVShow(item as TVShow)}
                    />
                  )
                )}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/movies"
            className="inline-flex items-center rounded-md bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Explore All Movies & Shows
          </Link>
        </div>
      </div>
    </div>
  )
}
