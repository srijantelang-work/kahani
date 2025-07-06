import { Link } from 'react-router-dom'
import { getImageUrl } from '../config/api'
import { FlipCard } from './common/FlipCard'
import { TVShow as TMDBTVShow } from '../services/tmdb'

interface TVShowCardProps {
  show: TMDBTVShow
  glass?: boolean
}

export const TVShowCard = ({ show, glass = true }: TVShowCardProps) => {
  const frontContent = (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg ${glass ? 'bg-transparent backdrop-blur-sm' : 'bg-black'} shadow`}
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={getImageUrl(show.poster_path)}
          alt={show.name}
          className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex-1">
          <h3
            className={`line-clamp-2 text-lg font-medium ${glass ? 'liquid-glass-text' : 'text-white'} group-hover:text-red-500`}
          >
            {show.name}
            {glass && <span className="shine-text"></span>}
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            {show.first_air_date.split('-')[0]}
          </p>
          <div className="mt-2 flex items-center">
            <span className="inline-flex items-center rounded-full bg-red-900/50 px-2.5 py-0.5 text-xs font-medium text-red-200">
              {show.vote_average.toFixed(1)}
            </span>
            <span className="ml-2 text-xs text-gray-400">
              {show.vote_count} votes
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
        <h3
          className={`text-xl font-medium ${glass ? 'liquid-glass-text' : 'text-white'}`}
        >
          {show.name}
          {glass && <span className="shine-text"></span>}
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          {new Date(show.first_air_date).getFullYear()}
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-2">
        <p className="line-clamp-[12] text-center text-sm leading-relaxed text-gray-300">
          {show.overview || 'No overview available.'}
        </p>
      </div>
      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">First Air Date:</span>
          <span className="font-medium text-white">
            {new Date(show.first_air_date).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Rating:</span>
          <div className="flex items-center">
            <span className="font-medium text-white">
              {show.vote_average.toFixed(1)}
            </span>
            <span className="ml-1 text-gray-400">
              ({show.vote_count?.toLocaleString() || 0} votes)
            </span>
          </div>
        </div>
        {show.original_language && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Language:</span>
            <span className="font-medium uppercase text-white">
              {show.original_language}
            </span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Link
      to={`/tv/${show.id}`}
      className="block h-full min-h-[32rem] w-full transform transition-all duration-300 hover:z-10 hover:scale-105"
    >
      <FlipCard front={frontContent} back={backContent} glass={glass} />
    </Link>
  )
}
