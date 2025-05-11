import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { GoogleBook } from '../services/google-books'

export const BookDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState<GoogleBook | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}?key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY}`
        )
        if (!response.ok) {
          throw new Error('Book not found')
        }
        const data = await response.json()
        setBook(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch book')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBook()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-xl text-red-600">{error || 'Book not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-gray-300 hover:text-white"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Go Back
        </button>
      </div>
    )
  }

  const { volumeInfo } = book

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-gray-300 hover:text-white"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Back to Books
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Book Cover */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <img
              src={
                volumeInfo.imageLinks?.thumbnail ||
                'https://via.placeholder.com/500x750?text=No+Cover'
              }
              alt={volumeInfo.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-white">
              {volumeInfo.title}
            </h1>
            {volumeInfo.subtitle && (
              <p className="mt-2 text-xl text-gray-400">
                {volumeInfo.subtitle}
              </p>
            )}

            <div className="mt-6 space-y-6">
              {/* Authors */}
              {volumeInfo.authors && (
                <div>
                  <h2 className="text-lg font-semibold text-white">Authors</h2>
                  <p className="mt-2 text-gray-300">
                    {volumeInfo.authors.join(', ')}
                  </p>
                </div>
              )}

              {/* Description */}
              {volumeInfo.description && (
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Description
                  </h2>
                  <p
                    className="mt-2 text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: volumeInfo.description,
                    }}
                  />
                </div>
              )}

              {/* Additional Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Publication Info */}
                {volumeInfo.publisher && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-400">
                      Publisher
                    </h2>
                    <p className="mt-1 text-white">{volumeInfo.publisher}</p>
                  </div>
                )}
                {volumeInfo.publishedDate && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-400">
                      Published Date
                    </h2>
                    <p className="mt-1 text-white">
                      {new Date(volumeInfo.publishedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Categories */}
                {volumeInfo.categories && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-400">
                      Categories
                    </h2>
                    <p className="mt-1 text-white">
                      {volumeInfo.categories.join(', ')}
                    </p>
                  </div>
                )}

                {/* Page Count */}
                {volumeInfo.pageCount && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-400">
                      Page Count
                    </h2>
                    <p className="mt-1 text-white">{volumeInfo.pageCount}</p>
                  </div>
                )}

                {/* Rating */}
                {volumeInfo.averageRating && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-400">
                      Rating
                    </h2>
                    <div className="mt-1 flex items-center">
                      <span className="text-white">
                        {volumeInfo.averageRating.toFixed(1)}
                      </span>
                      {volumeInfo.ratingsCount && (
                        <span className="ml-2 text-sm text-gray-400">
                          ({volumeInfo.ratingsCount.toLocaleString()} ratings)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
