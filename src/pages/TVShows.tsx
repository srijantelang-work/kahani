import { useState, useEffect } from 'react'
import { TVShowCard } from '../components/TVShowCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { MediaTrendingSection } from '../components/MediaTrendingSection'

interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string
  first_air_date: string
  vote_average: number
  vote_count: number
}

interface TVShowsResponse {
  results: TVShow[]
  total_pages: number
  total_results: number
}

export const TVShows = () => {
  const [shows, setShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&page=${page}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch TV shows')
        }
        const data: TVShowsResponse = await response.json()
        setShows(data.results)
        setTotalPages(Math.min(data.total_pages, 500)) // TMDB limits to 500 pages
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch TV shows'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [page])

  if (loading && shows.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="py-6">
      <MediaTrendingSection
        mediaType="tv"
        title="Trending TV Shows"
        subtitle="Discover the most popular TV shows right now"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shows.map(show => (
            <TVShowCard key={show.id} show={show} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center space-x-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages || loading}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
