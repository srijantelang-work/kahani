import { useParams } from 'react-router-dom'
import { useBookDetails } from '../hooks/useBooks'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

export const BookDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: book, isLoading, error } = useBookDetails(id || '')

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 w-1/4 rounded bg-gray-700"></div>
          <div className="mt-8 flex flex-col gap-8 lg:flex-row">
            <div className="h-[600px] w-[400px] rounded-lg bg-gray-700"></div>
            <div className="flex-1 space-y-6">
              <div className="h-8 w-3/4 rounded bg-gray-700"></div>
              <div className="h-4 w-1/2 rounded bg-gray-700"></div>
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-gray-700"></div>
                <div className="h-4 w-full rounded bg-gray-700"></div>
                <div className="h-4 w-3/4 rounded bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-900/20 p-4">
          <h3 className="text-sm font-medium text-red-400">
            Error Loading Book
          </h3>
          <div className="mt-2 text-sm text-red-300">
            <p>{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-300">Book not found</h3>
        </div>
      </div>
    )
  }

  const { volumeInfo } = book

  // Get the highest quality image available
  const coverImage =
    volumeInfo.imageLinks?.thumbnail ||
    volumeInfo.imageLinks?.smallThumbnail ||
    'https://via.placeholder.com/400x600/1f2937/9ca3af?text=No+Cover'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-200"
      >
        <ChevronLeftIcon className="mr-2 h-5 w-5" />
        Back to Books
      </button>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Book Cover */}
        <div className="lg:w-1/3">
          <img
            src={coverImage.replace('http://', 'https://')}
            alt={`${volumeInfo.title} cover`}
            className="h-auto w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Book Details */}
        <div className="lg:w-2/3">
          <h1 className="text-4xl font-bold text-white">{volumeInfo.title}</h1>
          {volumeInfo.subtitle && (
            <p className="mt-2 text-xl text-gray-300">{volumeInfo.subtitle}</p>
          )}

          {/* Authors */}
          {volumeInfo.authors && (
            <p className="mt-4 text-lg text-gray-300">
              By {volumeInfo.authors.join(', ')}
            </p>
          )}

          {/* Rating */}
          {(volumeInfo.averageRating || volumeInfo.ratingsCount) && (
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-lg font-medium text-white">
                  {volumeInfo.averageRating?.toFixed(1) || 'N/A'}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-300">
                  {volumeInfo.ratingsCount} ratings
                </span>
              </div>
            </div>
          )}

          {/* Categories/Genres */}
          {volumeInfo.categories && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-white">Genres</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {volumeInfo.categories.map((category, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-200"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {volumeInfo.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-white">Description</h2>
              <p
                className="mt-2 text-gray-300"
                dangerouslySetInnerHTML={{ __html: volumeInfo.description }}
              />
            </div>
          )}

          {/* Additional Details */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {/* Publisher */}
            {volumeInfo.publisher && (
              <div>
                <h3 className="text-sm font-medium text-gray-400">Publisher</h3>
                <p className="mt-1 text-sm text-gray-200">
                  {volumeInfo.publisher}
                </p>
              </div>
            )}

            {/* Publication Date */}
            {volumeInfo.publishedDate && (
              <div>
                <h3 className="text-sm font-medium text-gray-400">
                  Publication Date
                </h3>
                <p className="mt-1 text-sm text-gray-200">
                  {new Date(volumeInfo.publishedDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Page Count */}
            {volumeInfo.pageCount && (
              <div>
                <h3 className="text-sm font-medium text-gray-400">Pages</h3>
                <p className="mt-1 text-sm text-gray-200">
                  {volumeInfo.pageCount}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
