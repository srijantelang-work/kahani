import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import { TMDBMovie, TMDBResponse } from '../config/api'

export const useMovies = (page: number = 1) => {
  return useQuery<TMDBResponse<TMDBMovie>>({
    queryKey: ['movies', page],
    queryFn: async () => {
      const { data } = await apiClient.get<TMDBResponse<TMDBMovie>>(
        '/movie/popular',
        {
          params: { page },
        }
      )
      return data
    },
    placeholderData: keepPreviousPageData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useMovieDetails = (movieId: number) => {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      const { data } = await apiClient.get<TMDBMovie>(`/movie/${movieId}`)
      return data
    },
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Helper function to keep previous page data
const keepPreviousPageData = (
  previousData: TMDBResponse<TMDBMovie> | undefined
) => previousData

export const useSearchMovies = (query: string, page: number = 1) => {
  return useQuery<TMDBResponse<TMDBMovie>>({
    queryKey: ['search', query, page],
    queryFn: async () => {
      const { data } = await apiClient.get<TMDBResponse<TMDBMovie>>(
        '/search/movie',
        {
          params: { query, page },
        }
      )
      return data
    },
    enabled: !!query,
    placeholderData: keepPreviousPageData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
