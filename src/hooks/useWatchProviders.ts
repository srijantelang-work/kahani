import { useState, useEffect } from 'react'
import { WatchProvidersResponse } from '../config/api'

export const useWatchProviders = (
  mediaType: 'movie' | 'tv',
  mediaId: number
) => {
  const [data, setData] = useState<WatchProvidersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWatchProviders = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${mediaId}/watch/providers?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch watch providers')
        }

        const data: WatchProvidersResponse = await response.json()
        setData(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch watch providers'
        )
      } finally {
        setLoading(false)
      }
    }

    if (mediaId) {
      fetchWatchProviders()
    }
  }, [mediaType, mediaId])

  return { data, loading, error }
}
