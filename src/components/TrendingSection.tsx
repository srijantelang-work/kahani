import { useEffect, useState, useRef, useCallback } from 'react'
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

// Cache for trending data with timestamp
interface TrendingCache {
  data: MediaItem[]
  timestamp: number
}

const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes
const CACHE_KEY = 'kahani_trending_cache'

const getCachedTrending = (): MediaItem[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const { data, timestamp }: TrendingCache = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data
      }
    }
  } catch (error) {
    console.warn('Error reading trending cache:', error)
  }
  return null
}

const setCachedTrending = (data: MediaItem[]) => {
  try {
    const cache: TrendingCache = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.warn('Error setting trending cache:', error)
  }
}

export const TrendingSection = () => {
  const [trending, setTrending] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const fetchTrending = useCallback(async () => {
    if (hasLoaded) return

    setIsLoading(true)

    try {
      // Check cache first
      const cachedData = getCachedTrending()
      if (cachedData) {
        setTrending(cachedData)
        setHasLoaded(true)
        setIsLoading(false)
        return
      }

      // Fetch fresh data if no cache
      const data = await tmdb.getTrending()
      setTrending(data)
      setCachedTrending(data)
      setHasLoaded(true)
    } catch (error) {
      console.error('Error fetching trending items:', error)
    } finally {
      setIsLoading(false)
    }
  }, [hasLoaded])

  // Intersection Observer to defer API call until component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '100px 0px', // Start loading 100px before component is visible
        threshold: 0.1,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [hasLoaded])

  // Fetch data when component becomes visible
  useEffect(() => {
    if (isVisible && !hasLoaded) {
      fetchTrending()
    }
  }, [isVisible, hasLoaded, fetchTrending])

  // Check for cached data on mount to avoid unnecessary loading states
  useEffect(() => {
    const cachedData = getCachedTrending()
    if (cachedData) {
      setTrending(cachedData)
      setHasLoaded(true)
    }
  }, [])

  return (
    <div id="trending" className="bg-black py-24" ref={sectionRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="font-montserrat text-4xl font-semibold uppercase tracking-wider text-red-600">
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
          ) : trending.length > 0 ? (
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
          ) : !isVisible ? (
            // Show skeleton when not yet visible
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
            // Fallback for error state
            <div className="text-center text-gray-400">
              <p>Unable to load trending content. Please try again later.</p>
              <button
                onClick={() => {
                  setHasLoaded(false)
                  fetchTrending()
                }}
                className="mt-4 text-red-500 transition-colors hover:text-red-400"
              >
                Retry
              </button>
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
