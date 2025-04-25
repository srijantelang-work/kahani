export const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
export const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1'

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  vote_count: number
  runtime: number
  genres: Array<{
    id: number
    name: string
  }>
  production_companies: Array<{
    id: number
    name: string
    logo_path: string | null
    origin_country: string
  }>
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface GoogleBooksVolume {
  id: string
  volumeInfo: {
    title: string
    subtitle?: string
    authors?: string[]
    publisher?: string
    publishedDate?: string
    description?: string
    pageCount?: number
    categories?: string[]
    averageRating?: number
    ratingsCount?: number
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    language?: string
  }
}

export interface GoogleBooksResponse {
  kind: string
  totalItems: number
  items: GoogleBooksVolume[]
}

export const getImageUrl = (path: string | null) => {
  if (!path) return '/placeholder-movie.jpg'
  return `https://image.tmdb.org/t/p/w500${path}`
}
