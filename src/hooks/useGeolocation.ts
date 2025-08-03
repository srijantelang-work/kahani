import { useState, useEffect } from 'react'

interface GeolocationState {
  countryCode: string
  loading: boolean
  error: string | null
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    countryCode: 'US', // Default fallback
    loading: true,
    error: null,
  })

  useEffect(() => {
    const detectLocation = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))

        // Try to get location from IP geolocation service
        const response = await fetch('https://ipapi.co/json/')

        if (!response.ok) {
          throw new Error('Failed to detect location')
        }

        const data = await response.json()
        const countryCode = data.country_code || 'US'

        setState({
          countryCode,
          loading: false,
          error: null,
        })
      } catch (err) {
        console.warn('Geolocation failed, using default US region:', err)
        setState({
          countryCode: 'US',
          loading: false,
          error:
            err instanceof Error ? err.message : 'Failed to detect location',
        })
      }
    }

    detectLocation()
  }, [])

  return state
}
