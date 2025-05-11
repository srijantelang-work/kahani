import { GoogleBooksVolume } from '../config/api'
import { useNavigate } from 'react-router-dom'
import { FlipCard } from './common/FlipCard'

interface BookCardProps {
  book: GoogleBooksVolume
}

export const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate()
  const { volumeInfo } = book

  const handleClick = () => {
    if (book.id) {
      navigate(`/book/${book.id}`)
    }
  }

  const frontContent = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-black shadow">
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={
            volumeInfo.imageLinks?.thumbnail ||
            'https://via.placeholder.com/300x450/1a1a1a/666666?text=No+Cover'
          }
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
          {volumeInfo.authors && (
            <p className="mt-1 text-sm text-gray-400">
              {volumeInfo.authors.join(', ')}
            </p>
          )}
          {volumeInfo.averageRating && (
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center rounded-full bg-red-900/50 px-2.5 py-0.5 text-xs font-medium text-red-200">
                {volumeInfo.averageRating.toFixed(1)}
              </span>
              {volumeInfo.ratingsCount && (
                <span className="ml-2 text-xs text-gray-400">
                  {volumeInfo.ratingsCount} ratings
                </span>
              )}
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
        {volumeInfo.subtitle && (
          <p className="mt-1 text-sm italic text-gray-400">
            {volumeInfo.subtitle}
          </p>
        )}
        {volumeInfo.authors && (
          <p className="mt-1 text-sm text-gray-400">
            {volumeInfo.authors.join(', ')}
          </p>
        )}
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
              {new Date(volumeInfo.publishedDate).toLocaleDateString()}
            </span>
          </div>
        )}
        {(volumeInfo.averageRating || volumeInfo.ratingsCount) && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Rating:</span>
            <div className="flex items-center">
              <span className="font-medium text-white">
                {volumeInfo.averageRating?.toFixed(1) || 'N/A'}
              </span>
              {volumeInfo.ratingsCount && (
                <span className="ml-1 text-gray-400">
                  ({volumeInfo.ratingsCount.toLocaleString()} ratings)
                </span>
              )}
            </div>
          </div>
        )}
        {volumeInfo.pageCount && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Pages:</span>
            <span className="font-medium text-white">
              {volumeInfo.pageCount}
            </span>
          </div>
        )}
        {volumeInfo.language && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Language:</span>
            <span className="font-medium uppercase text-white">
              {volumeInfo.language}
            </span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div
      onClick={handleClick}
      className="block h-full min-h-[32rem] w-full transform cursor-pointer transition-all duration-300 hover:z-10 hover:scale-105"
    >
      <FlipCard front={frontContent} back={backContent} />
    </div>
  )
}
