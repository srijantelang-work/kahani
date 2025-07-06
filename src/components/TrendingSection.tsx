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
            className="liquid-glass-button relative inline-flex max-w-xs items-center justify-center overflow-hidden rounded-md px-6 py-3 text-base font-medium text-white transition-all duration-300 before:absolute before:inset-0 before:z-0 before:bg-gradient-to-r before:from-red-500/80 before:to-red-600/80 before:backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/25 hover:before:from-red-500/90 hover:before:to-red-600/90"
          >
            <span className="shine"></span>
            <span className="z-10">Explore All Movies & Shows</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
