import { useQuery } from '@tanstack/react-query'
import { booksClient } from '../lib/books-client'
import { GoogleBooksResponse, GoogleBooksVolume } from '../config/api'

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

export const useSearchBooks = (query: string, startIndex: number = 0) => {
  return useQuery<GoogleBooksResponse, BookError>({
    queryKey: ['books', 'search', query, startIndex],
    queryFn: async () => {
      try {
        if (isOffline()) {
          throw new Error('offline')
        }

        const { data } = await booksClient.get<GoogleBooksResponse>(
          '/volumes',
          {
            params: {
              q: query,
              startIndex,
              maxResults: 12,
            },
          }
        )
        return data
      } catch (error) {
        throw handleError(error)
      }
    },
    enabled: !!query,
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 24 hours
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: (failureCount, error: BookError) => {
      // Don't retry if we're offline or if it's a 404
      if (error.isOffline || error.code === '404') return false
      return failureCount < 3
    },
    // Show cached data when offline
    select: data => {
      if (isOffline()) {
        // You might want to add a visual indicator that the data is from cache
        return {
          ...data,
          items: data.items.map(item => ({
            ...item,
            fromCache: true,
          })),
        }
      }
      return data
    },
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

        const { data } = await booksClient.get<GoogleBooksVolume>(
          `/volumes/${bookId}`
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
