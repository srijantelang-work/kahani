import { useState } from 'react'
import { TVShowCard } from '../components/TVShowCard'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useTVShows, useSearchTVShows, TVShow } from '../hooks/useTVShows.ts'
import { PageHeader } from '../components/layout/PageHeader'

export const TVShows = () => {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const {
    data: showsData,
    isLoading: isShowsLoading,
    isFetching: isShowsFetching,
  } = useTVShows(page)

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useSearchTVShows(debouncedQuery, page)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    // Debounce search query
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value)
      setPage(1)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const data = searchQuery ? searchData : showsData
  const isLoading = searchQuery ? isSearchLoading : isShowsLoading
  const isFetching = searchQuery ? isSearchFetching : isShowsFetching

  const searchInput = (
    <div className="relative w-72">
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
        className="liquid-glass-input block w-full rounded-md border border-gray-700 bg-transparent pl-10 text-sm text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
        placeholder="Search TV shows..."
      />
    </div>
  )

  return (
    <>
      <PageHeader
        title="TV Shows"
        description="Explore series from around the world"
        rightContent={searchInput}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] animate-pulse rounded-lg bg-gray-800"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data?.results.map((show: TVShow) => (
                <TVShowCard key={show.id} show={show} />
              ))}
            </div>

            {data && data.total_pages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="liquid-glass-button relative rounded-md px-4 py-2 text-sm font-medium text-white transition-colors before:bg-red-900/50 hover:before:bg-red-900/75 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="shine"></span>
                  <span className="relative z-10">Previous</span>
                </button>
                <span className="text-sm text-gray-400">
                  Page {page} of {data.total_pages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === data.total_pages || isFetching}
                  className="liquid-glass-button relative rounded-md px-4 py-2 text-sm font-medium text-white transition-colors before:bg-red-900/50 hover:before:bg-red-900/75 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="shine"></span>
                  <span className="relative z-10">Next</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
