import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { TMDBMovie, getImageUrl } from '../config/api'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { MovieCard } from '../components/MovieCard'
import { useSimilarMovies } from '../hooks/useSimilarMovies'

export const MovieDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<TMDBMovie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { data: similarMovies, isLoading: isSimilarLoading } = useSimilarMovies(
    Number(id)
  )

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
        )
        if (!response.ok) {
          throw new Error('Movie not found')
        }
        const data = await response.json()
        setMovie(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movie')
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-xl text-red-600">{error || 'Movie not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-gray-300 hover:text-white"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center rounded-md bg-black/50 p-2 text-gray-300 transition-colors hover:bg-black/75 hover:text-white"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="lg:col-span-2">
            <h1 className="mb-4 text-4xl font-bold text-white">
              {movie.title}
            </h1>
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-red-900/50 px-3 py-1 text-sm text-white">
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className="rounded-full bg-red-900/50 px-3 py-1 text-sm text-white">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
              <span className="flex items-center rounded-full bg-red-900/50 px-3 py-1 text-sm text-white">
                <span className="mr-1">★</span>
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-gray-300">
              {movie.overview}
            </p>
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold text-white">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map(genre => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-red-600/20 px-3 py-1 text-sm text-red-400"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            {movie.production_companies &&
              movie.production_companies.length > 0 && (
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">
                    Production Companies
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {movie.production_companies.map(company => (
                      <span key={company.id} className="text-sm text-gray-400">
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Similar Movies Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-white">Similar Movies</h2>
          {isSimilarLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] animate-pulse rounded-lg bg-gray-800"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarMovies?.results
                .slice(0, 4)
                .map(movie => <MovieCard key={movie.id} movie={movie} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
