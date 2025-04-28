import { QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

// Create a persister for offline cache
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'KAHANI_CACHE', // Prefix for cache entries
  throttleTime: 1000, // Time (in ms) to throttle saving to storage
  serialize: data => JSON.stringify(data),
  deserialize: str => JSON.parse(str),
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
      gcTime: 24 * 60 * 60 * 1000, // Cache is kept for 24 hours
      retry: 3, // Retry failed requests 3 times
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: true, // Refetch when internet connection is restored
    },
  },
})

// Configure cache persistence
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  dehydrateOptions: {
    shouldDehydrateQuery: () => true,
  },
  maxAge: 24 * 60 * 60 * 1000, // Cache persists for 24 hours
  buster: import.meta.env.VITE_APP_VERSION || '1.0.0', // Cache buster on app updates
})
