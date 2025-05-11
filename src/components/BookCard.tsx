import { Link } from 'react-router-dom'
import { FlipCard } from './common/FlipCard'
import { GoogleBook } from '../services/google-books'

interface BookCardProps {
  book: GoogleBook
}

export const BookCard = ({ book }: BookCardProps) => {
  const { volumeInfo } = book
  const imageUrl =
    volumeInfo.imageLinks?.thumbnail ||
    'https://via.placeholder.com/500x750?text=No+Cover'

  const frontContent = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-black shadow">
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={volumeInfo.title}
          className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-lg font-medium text-white group-hover:text-red-500">
            {volumeInfo.title}
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            {volumeInfo.authors?.[0] || 'Unknown Author'}
          </p>
          {volumeInfo.averageRating && (
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center rounded-full bg-red-900/50 px-2.5 py-0.5 text-xs font-medium text-red-200">
                {volumeInfo.averageRating.toFixed(1)}
              </span>
              <span className="ml-2 text-xs text-gray-400">
                {volumeInfo.ratingsCount?.toLocaleString() || 0} ratings
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const backContent = (
    <div className="flex h-full flex-col bg-black p-4">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-medium text-white">{volumeInfo.title}</h3>
        <p className="mt-1 text-sm text-gray-400">
          {volumeInfo.authors?.join(', ') || 'Unknown Author'}
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-2">
        <p className="line-clamp-[12] text-center text-sm leading-relaxed text-gray-300">
          {volumeInfo.description || 'No description available.'}
        </p>
      </div>
      <div className="mt-auto space-y-2">
        {volumeInfo.publishedDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Published:</span>
            <span className="font-medium text-white">
              {new Date(volumeInfo.publishedDate).getFullYear()}
            </span>
          </div>
        )}
        {volumeInfo.averageRating && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Rating:</span>
            <div className="flex items-center">
              <span className="font-medium text-white">
                {volumeInfo.averageRating.toFixed(1)}
              </span>
              <span className="ml-1 text-gray-400">
                ({volumeInfo.ratingsCount?.toLocaleString() || 0} ratings)
              </span>
            </div>
          </div>
        )}
        {volumeInfo.categories && volumeInfo.categories.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Category:</span>
            <span className="font-medium text-white">
              {volumeInfo.categories[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Link
      to={`/book/${book.id}`}
      className="block h-full min-h-[32rem] w-full transform transition-all duration-300 hover:z-10 hover:scale-105"
    >
      <FlipCard front={frontContent} back={backContent} />
    </Link>
  )
}
