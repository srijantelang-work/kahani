import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string
  first_air_date: string
  vote_average: number
  vote_count: number
}

export interface TVShowsResponse {
  results: TVShow[]
  total_pages: number
  total_results: number
  page: number
}

export const useTVShows = (page: number = 1) => {
  return useQuery<TVShowsResponse>({
    queryKey: ['tv-shows', page],
    queryFn: async () => {
      const { data } = await apiClient.get<TVShowsResponse>('/tv/popular', {
        params: { page },
      })
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useSearchTVShows = (query: string, page: number = 1) => {
  return useQuery<TVShowsResponse>({
    queryKey: ['search-tv', query, page],
    queryFn: async () => {
      const { data } = await apiClient.get<TVShowsResponse>('/search/tv', {
        params: { query, page },
      })
      return data
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
