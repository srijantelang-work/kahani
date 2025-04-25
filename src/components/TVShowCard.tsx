import { Link } from 'react-router-dom'
import { getImageUrl } from '../config/api'

interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string
  first_air_date: string
  vote_average: number
  vote_count: number
}

interface TVShowCardProps {
  show: TVShow
}

export const TVShowCard = ({ show }: TVShowCardProps) => {
  return (
    <Link
      to={`/tv/${show.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-black shadow transition-transform hover:scale-105"
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={getImageUrl(show.poster_path)}
          alt={show.name}
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white group-hover:text-red-500">
            {show.name}
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
    </Link>
  )
}
