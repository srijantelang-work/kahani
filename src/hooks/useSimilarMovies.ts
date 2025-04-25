import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import { TMDBMovie, TMDBResponse } from '../config/api'

export const useSimilarMovies = (movieId: number) => {
  return useQuery<TMDBResponse<TMDBMovie>>({
    queryKey: ['similar-movies', movieId],
    queryFn: async () => {
      const { data } = await apiClient.get<TMDBResponse<TMDBMovie>>(
        `/movie/${movieId}/similar`,
        {
          params: { language: 'en-US' },
        }
      )
      return data
    },
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
