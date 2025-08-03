import { useState } from 'react'
import { WatchProvidersResponse, getProviderImageUrl } from '../config/api'
import { useGeolocation } from '../hooks/useGeolocation'
import { getSearchUrl } from '../utils/streamingLinks'
import { RegionSelector } from './RegionSelector'

interface WatchProvidersProps {
  data: WatchProvidersResponse | null
  loading: boolean
  error: string | null
  title: string
}

export const WatchProviders = ({
  data,
  loading,
  error,
  title,
}: WatchProvidersProps) => {
  const { countryCode, loading: locationLoading } = useGeolocation()
  const [selectedRegion, setSelectedRegion] = useState(countryCode)

  if (loading || locationLoading) {
    return (
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-white">Where to Watch</h3>
        <div className="flex items-center justify-center rounded-lg bg-gray-900/50 p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return null
  }

  // Get data for the selected country (fallback to US)
  const regionData = data.results[selectedRegion] || data.results.US
  if (!regionData) {
    return (
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-white">Where to Watch</h3>
        <div className="rounded-lg bg-gray-900/50 p-6">
          <p className="text-gray-400">
            Watch information not available for your region ({selectedRegion}).
          </p>
        </div>
      </div>
    )
  }

  const hasProviders =
    regionData.flatrate ||
    regionData.rent ||
    regionData.buy ||
    regionData.free ||
    regionData.ads

  if (!hasProviders) {
    return (
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-white">Where to Watch</h3>
        <div className="rounded-lg bg-gray-900/50 p-6">
          <p className="text-gray-400">
            This title is not currently available for streaming or purchase in
            your region ({selectedRegion}).
          </p>
        </div>
      </div>
    )
  }

  const renderProviderSection = (
    _title: string,
    providers: any[] | undefined,
    type: 'streaming' | 'rent' | 'buy' | 'free' | 'ads'
  ) => {
    if (!providers || providers.length === 0) return null

    const getTypeColor = (type: string) => {
      switch (type) {
        case 'streaming':
          return 'text-green-400'
        case 'rent':
          return 'text-yellow-400'
        case 'buy':
          return 'text-blue-400'
        case 'free':
          return 'text-green-400'
        case 'ads':
          return 'text-orange-400'
        default:
          return 'text-gray-400'
      }
    }

    const getTypeLabel = (type: string) => {
      switch (type) {
        case 'streaming':
          return 'Streaming'
        case 'rent':
          return 'Rent'
        case 'buy':
          return 'Buy'
        case 'free':
          return 'Free'
        case 'ads':
          return 'Free with Ads'
        default:
          return ''
      }
    }

    return (
      <div className="mb-6">
        <h4 className={`mb-3 text-sm font-semibold ${getTypeColor(type)}`}>
          {getTypeLabel(type)}
        </h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {providers.map(provider => {
            const streamingUrl = getSearchUrl(provider.provider_name, title)

            return (
              <a
                key={provider.provider_id}
                href={streamingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center rounded-lg bg-gray-800/50 p-3 transition hover:scale-105 hover:bg-gray-700/50"
              >
                <img
                  src={getProviderImageUrl(provider.logo_path)}
                  alt={provider.provider_name}
                  className="h-8 w-8 rounded object-contain transition group-hover:brightness-110"
                  onError={e => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                <span className="mt-2 text-center text-xs text-gray-300 group-hover:text-white">
                  {provider.provider_name}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Where to Watch</h3>
        <RegionSelector
          currentRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
        />
      </div>
      <div className="rounded-lg bg-gray-900/50 p-6">
        {renderProviderSection('Streaming', regionData.flatrate, 'streaming')}
        {renderProviderSection('Rent', regionData.rent, 'rent')}
        {renderProviderSection('Buy', regionData.buy, 'buy')}
        {renderProviderSection('Free', regionData.free, 'free')}
        {renderProviderSection('Free with Ads', regionData.ads, 'ads')}
      </div>
    </div>
  )
}
