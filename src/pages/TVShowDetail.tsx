import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import { ContentDetail } from '../components/ContentDetail'
import { ContentCarousel } from '../components/ContentCarousel'

interface TVShowDetail {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genres: { id: number; name: string }[]
  number_of_seasons: number
  number_of_episodes: number
  status: string
  networks: { id: number; name: string; logo_path: string | null }[]
  seasons: {
    id: number
    name: string
    overview: string
    poster_path: string | null
    episode_count: number
    air_date: string
    season_number: number
  }[]
}

export const TVShowDetail = () => {
  const { id } = useParams<{ id: string }>()

  const { data: show, isLoading } = useQuery<TVShowDetail>({
    queryKey: ['tv', id],
    queryFn: async () => {
      const { data } = await apiClient.get<TVShowDetail>(`/tv/${id}`)
      return data
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const additionalInfo = show && (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold">Details</h3>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-400">Status</dt>
            <dd>{show.status}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Networks</dt>
            <dd className="flex gap-2">
              {show.networks.map(network => (
                <span key={network.id}>{network.name}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Seasons</dt>
            <dd>{show.number_of_seasons}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Episodes</dt>
            <dd>{show.number_of_episodes}</dd>
          </div>
        </dl>
      </div>

      {show.seasons.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold">Seasons</h3>
          <div className="mt-4">
            <ContentCarousel
              items={show.seasons}
              renderItem={season => (
                <div className="w-48 flex-shrink-0">
                  <div className="aspect-[2/3] overflow-hidden rounded-lg">
                    <img
                      src={
                        season.poster_path
                          ? `https://image.tmdb.org/t/p/w300${season.poster_path}`
                          : '/placeholder-poster.jpg'
                      }
                      alt={season.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-2">
                    <h4 className="line-clamp-1 font-medium">{season.name}</h4>
                    <p className="text-sm text-gray-300">
                      {season.episode_count} episodes
                    </p>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      )}
    </div>
  )

  return (
    <ContentDetail
      loading={isLoading}
      title={show?.name ?? ''}
      releaseDate={
        show?.first_air_date
          ? new Date(show.first_air_date).getFullYear().toString()
          : undefined
      }
      rating={show?.vote_average}
      ratingCount={show?.vote_count}
      posterImage={
        show?.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : undefined
      }
      backdropImage={
        show?.backdrop_path
          ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
          : undefined
      }
      overview={show?.overview}
      genres={show?.genres.map(g => g.name)}
      additionalInfo={additionalInfo}
    />
  )
}
