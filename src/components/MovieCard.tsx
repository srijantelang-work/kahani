import { Link } from 'react-router-dom'
import { TMDBMovie, getImageUrl } from '../config/api'

interface MovieCardProps {
  movie: TMDBMovie
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
            {movie.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {movie.release_date.split('-')[0]}
          </p>
          <div className="mt-2 flex items-center">
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="ml-2 text-xs text-gray-500">
              {movie.vote_count} votes
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
