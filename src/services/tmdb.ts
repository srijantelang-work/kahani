const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
  media_type: 'movie'
  overview?: string
  vote_count?: number
  original_language?: string
}

export interface TVShow {
  id: number
  name: string
  poster_path: string
  vote_average: number
  first_air_date: string
  media_type: 'tv'
  overview?: string
  vote_count?: number
  original_language?: string
  genre_ids?: number[]
  popularity?: number
  backdrop_path?: string
}

export interface TVShowsResponse {
  page: number
  results: TVShow[]
  total_pages: number
  total_results: number
}

export type MediaItem = Movie | TVShow

export const tmdb = {
  getImageUrl: (path: string | null, size: string = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image'
    return `${IMAGE_BASE_URL}/${size}${path}`
  },

  getTrending: async (
    mediaType: 'movie' | 'tv' = 'movie',
    timeWindow: 'day' | 'week' = 'week'
  ) => {
    const response = await fetch(
      `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}`
    )
    const data = await response.json()
    return data.results.map((item: any) => ({
      ...item,
      media_type: mediaType,
    })) as MediaItem[]
  },

  searchMedia: async (
    query: string,
    mediaType: 'movie' | 'tv',
    year?: number | string
  ): Promise<MediaItem | null> => {
    const searchType = mediaType === 'movie' ? 'movie' : 'tv'
    let url = `${BASE_URL}/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`

    if (mediaType === 'movie' && year) {
      url += `&primary_release_year=${year}`
    }
    if (mediaType === 'tv' && year) {
      url += `&first_air_date_year=${year}`
    }

    try {
      console.log(`[TMDB Search] URL: ${url}`)
      const response = await fetch(url)
      if (!response.ok) {
        console.error(
          `[TMDB Search] Error fetching ${mediaType}: ${response.status} ${response.statusText}`
        )
        return null
      }
      const data = await response.json()
      console.log(
        `[TMDB Search] Response for "${query}" (${year || 'any year'}):`,
        data.results
      )

      if (data.results && data.results.length > 0) {
        const firstResult = { ...data.results[0], media_type: searchType }
        return firstResult as MediaItem
      }
      return null
    } catch (error) {
      console.error(
        `[TMDB Search] Error searching ${mediaType} for "${query}":`,
        error
      )
      return null
    }
  },

  getPopularTVShows: async (
    page: number = 1,
    options: {
      minVoteCount?: number
      language?: string
      region?: string
    } = {}
  ) => {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      page: page.toString(),
      sort_by: 'popularity.desc',
      'vote_count.gte': (options.minVoteCount || 100).toString(),
      language: options.language || 'en-US',
      with_original_language: options.language?.split('-')[0] || 'en',
    })

    const response = await fetch(`${BASE_URL}/tv/popular?${params.toString()}`)
    const data = await response.json()
    return data as TVShowsResponse
  },
}
