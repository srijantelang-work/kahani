import { useEffect, useState } from 'react'
import { MediaItem, tmdb } from '../services/tmdb'
import { MovieCard } from './MovieCard'
import { TVShowCard } from './TVShowCard'
import { BookCard } from './BookCard'
import { GoogleBooksVolume } from '../config/api'

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
  const [trending, setTrending] = useState<MediaItem[] | GoogleBooksVolume[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setIsLoading(true)
        if (mediaType === 'movie' || mediaType === 'tv') {
          const data = await tmdb.getTrending(mediaType)
          setTrending(data)
        } else if (mediaType === 'book') {
          // For books, we'll use a predefined query for trending books
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=8`
          )
          const data = await response.json()
          setTrending(data.items || [])
        }
      } catch (error) {
        console.error('Error fetching trending items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrending()
  }, [mediaType])

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
          <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {mediaType === 'movie' &&
              (trending as MediaItem[]).map(item => (
                <MovieCard key={item.id} movie={item as any} />
              ))}
            {mediaType === 'tv' &&
              (trending as MediaItem[]).map(item => (
                <TVShowCard key={item.id} show={item as any} />
              ))}
            {mediaType === 'book' &&
              (trending as GoogleBooksVolume[]).map(book => (
                <BookCard key={book.id} book={book} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
