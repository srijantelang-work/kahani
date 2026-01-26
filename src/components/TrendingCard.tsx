import { Link } from 'react-router-dom'
import { getImageUrl } from '../config/api'
import { FlipCard } from './common/FlipCard'

export interface TrendingItem {
  id: number
  title: string
  name?: string // For TV shows
  overview: string
  poster_path: string
  release_date?: string
  first_air_date?: string
  vote_average: number
  vote_count: number
  media_type: 'movie' | 'tv'
}

interface TrendingCardProps {
  item: TrendingItem
  glass?: boolean
}

export const TrendingCard = ({ item, glass = false }: TrendingCardProps) => {
  const isTV = item.media_type === 'tv'
  const title = isTV ? item.name : item.title
  const date = isTV ? item.first_air_date : item.release_date

  const frontContent = (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg ${glass ? 'bg-transparent backdrop-blur-sm' : 'bg-black'} shadow`}
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={getImageUrl(item.poster_path)}
          alt={title}
          className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-red-900/50 px-2 py-0.5 text-xs font-medium uppercase text-red-200">
              {item.media_type}
            </span>
          </div>
          <h3
            className={`line-clamp-2 text-lg font-medium ${glass ? 'liquid-glass-text' : 'text-white'} group-hover:text-red-500`}
          >
            {title}
            {glass && <span className="shine-text"></span>}
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            {date ? new Date(date).getFullYear() : 'TBA'}
          </p>
          <div className="mt-2 flex items-center">
            <span className="inline-flex items-center rounded-full bg-red-900/50 px-2.5 py-0.5 text-xs font-medium text-red-200">
              {item.vote_average.toFixed(1)}
            </span>
            <span className="ml-2 text-xs text-gray-400">
              {item.vote_count} votes
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const backContent = (
    <div
      className={`flex h-full flex-col ${glass ? 'border border-white/10 bg-transparent backdrop-blur-sm' : 'bg-black'} p-4`}
    >
      <div className="mb-4 text-center">
        <span className="mb-2 inline-block rounded-full bg-red-900/50 px-2 py-0.5 text-xs font-medium uppercase text-red-200">
          {item.media_type}
        </span>
        <h3
          className={`text-xl font-medium ${glass ? 'liquid-glass-text' : 'text-white'}`}
        >
          {title}
          {glass && <span className="shine-text"></span>}
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          {date ? new Date(date).getFullYear() : 'TBA'}
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-2">
        <p className="line-clamp-[12] text-center text-sm leading-relaxed text-gray-300">
          {item.overview || 'No overview available.'}
        </p>
      </div>
      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {isTV ? 'First Air Date:' : 'Release Date:'}
          </span>
          <span className="font-medium text-white">
            {date ? new Date(date).toLocaleDateString() : 'TBA'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Rating:</span>
          <div className="flex items-center">
            <span className="font-medium text-white">
              {item.vote_average.toFixed(1)}
            </span>
            <span className="ml-1 text-gray-400">
              ({item.vote_count.toLocaleString()} votes)
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Type:</span>
          <span className="font-medium uppercase text-white">
            {item.media_type}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <Link
      to={`/${item.media_type}/${item.id}`}
      className="block h-full min-h-[32rem] w-full transform transition-all duration-300 hover:z-10 hover:scale-105"
    >
      <FlipCard front={frontContent} back={backContent} glass={glass} />
    </Link>
  )
}
