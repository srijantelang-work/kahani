import { useState } from 'react'
import { useMovies, useSearchMovies } from '../hooks/useMovies'
import { MovieCard } from '../components/MovieCard'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { TMDBMovie, TMDBResponse } from '../config/api'
import { MediaTrendingSection } from '../components/MediaTrendingSection'

export const Movies = () => {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const {
    data: moviesData,
    isLoading: isMoviesLoading,
    isFetching: isMoviesFetching,
  } = useMovies(page)

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useSearchMovies(debouncedQuery, page)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    // Debounce search query
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value)
      setPage(1)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const data = (searchQuery ? searchData : moviesData) as
    | TMDBResponse<TMDBMovie>
    | undefined
  const isLoading = searchQuery ? isSearchLoading : isMoviesLoading
  const isFetching = searchQuery ? isSearchFetching : isMoviesFetching

  return (
    <div className="py-6">
      <MediaTrendingSection
        mediaType="movie"
        title="Trending Movies"
        subtitle="Discover the most popular movies right now"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Movies</h1>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search movies..."
            />
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data?.results.map((movie: TMDBMovie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {data && data.total_pages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {page} of {data.total_pages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === data.total_pages || isFetching}
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
