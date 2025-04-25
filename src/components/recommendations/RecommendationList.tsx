import React from 'react'
import { Genre, Mood } from '../../hooks/useRecommendations'
import { getImageUrl } from '../../config/api'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

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
      ? getImageUrl(item.poster_path || null) // TMDB paths need prefix
      : item.poster_path // Google Books provides full URL
        ? item.poster_path // Use the full URL directly if available
        : 'https://via.placeholder.com/150x225/e2e8f0/64748b?text=No+Cover' // Fallback placeholder

  console.log(
    `[RecommendationCard] Title: ${item.title}, Poster Path: ${item.poster_path}, Generated Image Src: ${imageSrc}`
  )

  const cardContent = (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-gray-900 shadow transition-transform hover:scale-105">
      <div className="aspect-[2/3] w-full overflow-hidden bg-gray-800">
        <img
          src={imageSrc}
          alt={`${item.title} poster`}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          onError={e => {
            console.error(
              `Error loading image for ${item.title}: ${imageSrc}`,
              e
            )
            // Optionally set to a placeholder on error:
            // (e.target as HTMLImageElement).src = '/placeholder-movie.jpg';
          }}
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-medium text-white group-hover:text-red-500">
          {item.title} {item.year ? `(${item.year})` : ''}
        </h3>
        {item.rating && (
          <div className="mt-1 flex items-center">
            <span className="inline-flex items-center rounded-full bg-red-900/50 px-2.5 py-0.5 text-xs font-medium text-red-200">
              ★ {item.rating.toFixed(1)}
            </span>
          </div>
        )}
        <p className="mt-2 line-clamp-3 text-sm text-gray-400">
          {item.description}
        </p>
        {item.reason && (
          <p className="mt-2 text-xs italic text-gray-500">
            Reason: {item.reason}
          </p>
        )}
      </div>
    </div>
  )

  if (linkPath) {
    return (
      <Link to={linkPath} className="group block h-full">
        {cardContent}
      </Link>
    )
  }

  return <div className="group h-full">{cardContent}</div>
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
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
