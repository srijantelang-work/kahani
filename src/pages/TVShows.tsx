import { useState } from 'react'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { apiClient } from '../lib/api-client'
import { ContentCarousel } from '../components/ContentCarousel'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
}

interface TVShowsResponse {
  page: number
  results: TVShow[]
  total_pages: number
  total_results: number
}

export const TVShows = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const { data, isLoading, isFetchingNextPage, loadMoreRef } =
    useInfiniteScroll<TVShowsResponse>({
      queryKey: ['tv', 'popular', debouncedQuery],
      fetchFn: async page => {
        const endpoint = debouncedQuery ? '/search/tv' : '/tv/popular'
        const { data } = await apiClient.get<TVShowsResponse>(endpoint, {
          params: {
            page,
            query: debouncedQuery || undefined,
          },
        })
        return data
      },
      getNextPageParam: lastPage =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
      enabled: true,
    })

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    const timeoutId = setTimeout(() => setDebouncedQuery(value), 500)
    return () => clearTimeout(timeoutId)
  }

  const allShows = data?.pages.flatMap(page => page.results) ?? []
  const popularShows = allShows.slice(0, 20)
  const topRatedShows = allShows
    .slice(0, 20)
    .sort((a, b) => b.vote_average - a.vote_average)

  const renderTVShow = (show: TVShow) => (
    <div className="w-48 flex-shrink-0">
      <div className="aspect-[2/3] overflow-hidden rounded-lg">
        <img
          src={
            show.poster_path
              ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
              : '/placeholder-poster.jpg'
          }
          alt={show.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-2">
        <h3 className="line-clamp-1 text-sm font-medium text-gray-900">
          {show.name}
        </h3>
        <p className="text-sm text-gray-500">
          {new Date(show.first_air_date).getFullYear()}
        </p>
      </div>
    </div>
  )

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">TV Shows</h1>
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
              placeholder="Search TV shows..."
            />
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {!debouncedQuery && (
            <>
              <ContentCarousel
                title="Popular Shows"
                items={popularShows}
                renderItem={renderTVShow}
              />
              <ContentCarousel
                title="Top Rated"
                items={topRatedShows}
                renderItem={renderTVShow}
              />
            </>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allShows.map(show => (
              <div key={show.id}>{renderTVShow(show)}</div>
            ))}
          </div>

          {(isFetchingNextPage || isLoading) && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] animate-pulse rounded-lg bg-gray-200"
                />
              ))}
            </div>
          )}

          <div ref={loadMoreRef} className="h-20" />
        </div>
      </div>
    </div>
  )
}
