import React from 'react'
import { Genre, Mood } from '../../hooks/useRecommendations'
import { getImageUrl } from '../../config/api'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { FlipCard } from '../common/FlipCard'

interface RecommendationItemProps {
  title: string
  description: string
  genres: Genre[]
  rating: number
  length: number
  mood: Mood[]
  reason: string
  onSelect?: () => void
  year?: number
  poster_path?: string
  id?: string | number
}

interface RecommendationListProps {
  recommendations: RecommendationItemProps[]
  mediaType: 'movie' | 'tv' | 'book'
  className?: string
}

const RecommendationCard = ({
  item,
  mediaType,
}: {
  item: RecommendationItemProps
  mediaType: 'movie' | 'tv' | 'book'
}) => {
  const linkPath =
    mediaType === 'movie'
      ? `/movie/${item.id}`
      : mediaType === 'tv'
        ? `/tv/${item.id}`
        : undefined // No link for books yet

  const imageSrc =
    mediaType === 'movie' || mediaType === 'tv'
      ? getImageUrl(item.poster_path || null)
      : item.poster_path
        ? item.poster_path
        : 'https://via.placeholder.com/300x450/1a1a1a/666666?text=No+Cover'

  const frontContent = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-black shadow">
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={`${item.title} poster`}
          className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
          onError={e => {
            console.error(
              `Error loading image for ${item.title}: ${imageSrc}`,
              e
            )
            e.currentTarget.src =
              'https://via.placeholder.com/300x450/1a1a1a/666666?text=No+Cover'
          }}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex-1 space-y-3">
          <h3 className="line-clamp-2 text-lg font-medium text-white group-hover:text-red-500">
            {item.title} {item.year ? `(${item.year})` : ''}
          </h3>
          {item.rating && (
            <div className="flex items-center">
              <span className="inline-flex items-center rounded-full bg-red-900/50 px-2.5 py-0.5 text-xs font-medium text-red-200">
                ★ {item.rating.toFixed(1)}
              </span>
            </div>
          )}
          {item.reason && (
            <div className="flex-1">
              <p className="line-clamp-4 text-sm italic text-gray-400">
                {item.reason}
              </p>
            </div>
          )}
          {item.genres && item.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.genres.slice(0, 2).map(genre => (
                <span
                  key={genre}
                  className="rounded-full bg-red-900/20 px-2 py-0.5 text-xs text-red-200"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const backContent = (
    <div className="flex h-full flex-col bg-black p-4">
      <h3 className="mb-2 text-center text-lg font-medium text-white">
        {item.title} {item.year ? `(${item.year})` : ''}
      </h3>
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="mb-4 line-clamp-[12] text-center text-sm text-gray-300">
          {item.description}
        </p>
      </div>
      <div className="mt-auto space-y-2">
        {item.genres && item.genres.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Genres:</span>
            <div className="flex flex-wrap justify-end gap-1">
              {item.genres.map(genre => (
                <span
                  key={genre}
                  className="rounded-full bg-red-900/20 px-2 py-0.5 text-xs text-red-200"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}
        {item.mood && item.mood.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Mood:</span>
            <div className="flex flex-wrap justify-end gap-1">
              {item.mood.map(mood => (
                <span
                  key={mood}
                  className="rounded-full bg-red-900/20 px-2 py-0.5 text-xs text-red-200"
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>
        )}
        {item.rating && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Rating:</span>
            <span className="font-medium text-white">
              ★ {item.rating.toFixed(1)}
            </span>
          </div>
        )}
        {item.length && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Length:</span>
            <span className="font-medium text-white">
              {mediaType === 'movie'
                ? `${item.length} min`
                : mediaType === 'book'
                  ? `${item.length} pages`
                  : `${item.length} episodes`}
            </span>
          </div>
        )}
      </div>
    </div>
  )

  const cardWrapper = (
    <div className="block h-full min-h-[36rem] w-full transform cursor-pointer transition-all duration-300 hover:z-10 hover:scale-105">
      <FlipCard front={frontContent} back={backContent} />
    </div>
  )

  if (linkPath) {
    return (
      <Link to={linkPath} className="block h-full">
        {cardWrapper}
      </Link>
    )
  }

  return cardWrapper
}

export const RecommendationList = ({
  recommendations,
  mediaType,
  className,
}: RecommendationListProps) => {
  return (
    <div className={cn('w-full', className)}>
      <h2 className="mb-6 text-2xl font-bold text-white">
        Your Recommendations
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recommendations.map((item, index) => (
          <RecommendationCard
            key={`${item.id || index}-${item.title}`}
            item={item}
            mediaType={mediaType}
          />
        ))}
      </div>
    </div>
  )
}
