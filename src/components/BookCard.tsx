import { GoogleBooksVolume } from '../config/api'

interface BookCardProps {
  book: GoogleBooksVolume
}

export const BookCard = ({ book }: BookCardProps) => {
  const { volumeInfo } = book
  const thumbnail = volumeInfo.imageLinks?.thumbnail || '/placeholder-book.jpg'

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow transition hover:shadow-lg">
      <div className="relative aspect-[3/4] bg-gray-200">
        <img
          src={thumbnail}
          alt={volumeInfo.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-lg font-medium text-gray-900">
            {volumeInfo.title}
          </h3>
          {volumeInfo.authors && (
            <p className="mt-1 text-sm text-gray-500">
              {volumeInfo.authors.join(', ')}
            </p>
          )}
          {volumeInfo.publishedDate && (
            <p className="mt-1 text-sm text-gray-500">
              {new Date(volumeInfo.publishedDate).getFullYear()}
            </p>
          )}
        </div>
        {(volumeInfo.averageRating || volumeInfo.ratingsCount) && (
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">
                {volumeInfo.averageRating?.toFixed(1) || 'N/A'}
              </span>
              <span className="mx-1 text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                {volumeInfo.ratingsCount} ratings
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
