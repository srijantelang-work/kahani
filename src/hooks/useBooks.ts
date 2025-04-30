import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

// Custom error type for better error handling
export interface BookError {
  code: string
  message: string
  isOffline?: boolean
}

const isOffline = () => !navigator.onLine

// Helper function to handle API errors
const handleError = (error: any): BookError => {
  if (isOffline()) {
    return {
      code: 'OFFLINE',
      message: 'You are currently offline. Showing cached results.',
      isOffline: true,
    }
  }

  if (error.response?.data?.error) {
    return {
      code: error.response.data.error.code || 'API_ERROR',
      message: error.response.data.error.message || 'An error occurred',
    }
  }

  return {
    code: 'UNKNOWN',
    message: 'An unexpected error occurred',
  }
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
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    averageRating?: number
    ratingsCount?: number
    categories?: string[]
  }
}

interface GoogleBooksResponse {
  items: GoogleBooksVolume[]
  totalItems: number
}

export const useBooks = (page: number = 1) => {
  return useQuery<GoogleBooksResponse>({
    queryKey: ['books', page],
    queryFn: async () => {
      const startIndex = (page - 1) * 12
      const { data } = await apiClient.get<GoogleBooksResponse>(
        'https://www.googleapis.com/books/v1/volumes',
        {
          params: {
            q: 'subject:fiction',
            startIndex,
            maxResults: 12,
            key: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
          },
        }
      )
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useSearchBooks = (query: string, page: number = 1) => {
  return useQuery<GoogleBooksResponse>({
    queryKey: ['search-books', query, page],
    queryFn: async () => {
      const startIndex = (page - 1) * 12
      const { data } = await apiClient.get<GoogleBooksResponse>(
        'https://www.googleapis.com/books/v1/volumes',
        {
          params: {
            q: query,
            startIndex,
            maxResults: 12,
            key: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
          },
        }
      )
      return data
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useBookDetails = (bookId: string) => {
  return useQuery<GoogleBooksVolume, BookError>({
    queryKey: ['book', bookId],
    queryFn: async () => {
      try {
        if (isOffline()) {
          throw new Error('offline')
        }

        const { data } = await apiClient.get<GoogleBooksVolume>(
          `/volumes/${bookId}`,
          {
            params: {
              key: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
            },
          }
        )
        return data
      } catch (error) {
        throw handleError(error)
      }
    },
    enabled: !!bookId,
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 24 hours
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    retry: (failureCount, error: BookError) => {
      if (error.isOffline || error.code === '404') return false
      return failureCount < 3
    },
  })
}
