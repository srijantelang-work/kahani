import { useEffect, useState } from 'react'

import { MediaItem, tmdb, TVShow } from '../services/tmdb'
import { MovieCard } from './MovieCard'
import { TVShowCard } from './TVShowCard'
import { BookCard } from './BookCard'
import { GoogleBook, googleBooks } from '../services/google-books'

interface MediaTrendingSectionProps {
  mediaType: 'movie' | 'tv' | 'book'
  title: string
  subtitle: string
}

export const MediaTrendingSection = ({
  mediaType,
  title,
  subtitle,
}: MediaTrendingSectionProps) => {
  const [trending, setTrending] = useState<MediaItem[] | GoogleBook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setIsLoading(true)
        if (mediaType === 'movie') {
          const data = await tmdb.getTrending('movie')
          setTrending(data)
        } else if (mediaType === 'tv') {
          const data = await tmdb.getPopularTVShows(page, {
            minVoteCount: 100,
            language: 'en-US',
          })
          setTrending(data.results)
          setTotalPages(Math.min(data.total_pages, 500)) // TMDB caps at 500 pages
        } else if (mediaType === 'book') {
          const data = await googleBooks.getPopularBooks({
            startIndex: (page - 1) * 8,
            maxResults: 8,
            minRating: 4,
            minRatingsCount: 100,
            orderBy: 'relevance',
          })
          setTrending(data.items)
          setTotalPages(Math.ceil(Math.min(data.totalItems, 1000) / 8)) // Limit to 1000 results
        }
      } catch (error) {
        console.error('Error fetching trending items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrending()
  }, [mediaType, page])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-4xl font-bold uppercase tracking-wider text-red-600">
            TRENDING NOW
          </h2>
          <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-white sm:text-4xl">
            {title}
          </p>
          <p className="mt-4 text-xl text-gray-300">{subtitle}</p>
        </div>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] rounded-lg bg-gray-800"></div>
                <div className="mt-4 h-4 w-3/4 rounded bg-gray-800"></div>
                <div className="mt-2 h-4 w-1/2 rounded bg-gray-800"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
              {mediaType === 'movie' &&
                (trending as MediaItem[]).map(item => (
                  <MovieCard key={item.id} movie={item as any} />
                ))}
              {mediaType === 'tv' &&
                (trending as TVShow[]).map(show => (
                  <TVShowCard key={show.id} show={show} />
                ))}
              {mediaType === 'book' &&
                (trending as GoogleBook[]).map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isLoading}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || isLoading}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
