import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getImageUrl } from '../config/api'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useWatchProviders } from '../hooks/useWatchProviders'
import { WatchProviders } from '../components/WatchProviders'

interface Season {
  id: number
  name: string
  overview: string
  poster_path: string
  air_date: string
  episode_count: number
  season_number: number
}

interface TVShowDetails {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
  vote_average: number
  vote_count: number
  number_of_seasons: number
  number_of_episodes: number
  seasons: Season[]
  genres: Array<{
    id: number
    name: string
  }>
  status: string
  networks: Array<{
    id: number
    name: string
    logo_path: string
  }>
}

export const TVShowDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [show, setShow] = useState<TVShowDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    data: watchProviders,
    loading: watchProvidersLoading,
    error: watchProvidersError,
  } = useWatchProviders('tv', Number(id))

  useEffect(() => {
    const fetchTVShow = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
        )
        if (!response.ok) {
          throw new Error('TV show not found')
        }
        const data = await response.json()
        setShow(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch TV show')
      } finally {
        setLoading(false)
      }
    }

    fetchTVShow()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !show) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-xl text-red-600">{error || 'TV show not found'}</p>
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
          className="mb-6 flex items-center text-gray-300 hover:text-white"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Back to TV Shows
        </button>

        {/* Show Header */}
        <div className="mb-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <img
              src={getImageUrl(show.poster_path)}
              alt={show.name}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="lg:col-span-2">
            <h1 className="mb-4 text-4xl font-bold text-white">{show.name}</h1>
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-red-900/50 px-3 py-1 text-sm text-white">
                {new Date(show.first_air_date).getFullYear()}
              </span>
              <span className="rounded-full bg-red-900/50 px-3 py-1 text-sm text-white">
                {show.number_of_seasons} Seasons
              </span>
              <span className="flex items-center rounded-full bg-red-900/50 px-3 py-1 text-sm text-white">
                <span className="mr-1">★</span>
                {show.vote_average.toFixed(1)}
              </span>
            </div>
            <p className="description-text mb-6 text-lg leading-relaxed text-gray-300">
              {show.overview}
            </p>

            {/* Watch Providers Section */}
            <WatchProviders
              data={watchProviders}
              loading={watchProvidersLoading}
              error={watchProvidersError}
              title={show.name}
            />

            <div className="mb-6">
              <h2 className="subheading mb-2 text-xl text-white">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {show.genres.map(genre => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-red-600/20 px-3 py-1 text-sm text-red-400"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Seasons Section */}
        <div className="mt-12">
          <h2 className="subheading mb-6 text-2xl text-white">Seasons</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {show.seasons
              .filter(season => season.season_number > 0) // Filter out specials
              .map(season => (
                <div
                  key={season.id}
                  className="flex flex-col overflow-hidden rounded-lg bg-gray-900"
                >
                  <div className="aspect-[2/3] w-full overflow-hidden">
                    <img
                      src={getImageUrl(season.poster_path)}
                      alt={`${show.name} ${season.name}`}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="subheading text-lg text-white">
                      {season.name}
                    </h3>
                    <p className="description-text mt-1 text-sm text-gray-400">
                      {season.episode_count} Episodes
                    </p>
                    {season.air_date && (
                      <p className="description-text mt-1 text-sm text-gray-400">
                        {new Date(season.air_date).getFullYear()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
