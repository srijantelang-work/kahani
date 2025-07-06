import { useState, useMemo } from 'react'
import { TrashIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useRecommendationStore } from '../stores/recommendationStore'
import { RecommendationList } from '../components/recommendations/RecommendationList'
import { PageHeader } from '../components/layout/PageHeader'

export const History = () => {
  const { recentRecommendations, deleteRecommendation, clearRecommendations } =
    useRecommendationStore()
  const [selectedMediaType, setSelectedMediaType] = useState<
    'all' | 'movie' | 'tv' | 'book'
  >('all')

  // Filter recommendations based on selected media type
  const filteredRecommendations = useMemo(() => {
    if (selectedMediaType === 'all') {
      return recentRecommendations
    }
    return recentRecommendations.filter(
      rec => rec.mediaType === selectedMediaType
    )
  }, [recentRecommendations, selectedMediaType])

  const handleDeleteRecommendation = async (recommendationId: string) => {
    try {
      if (
        window.confirm('Are you sure you want to delete this recommendation?')
      ) {
        deleteRecommendation(recommendationId)

        // Also remove from URL if it matches the deleted recommendation
        const searchParams = new URLSearchParams(window.location.search)
        const storedPrompt = searchParams.get('prompt')
        const deletedRec = recentRecommendations.find(
          rec => rec.id === recommendationId
        )

        if (deletedRec && storedPrompt === deletedRec.prompt) {
          searchParams.delete('prompt')
          searchParams.delete('type')
          window.history.replaceState(
            {},
            '',
            window.location.pathname +
              (searchParams.toString() ? `?${searchParams.toString()}` : '')
          )
        }
      }
    } catch (error) {
      console.error('Error deleting recommendation:', error)
    }
  }

  const handleClearAll = async () => {
    try {
      if (
        window.confirm(
          'Are you sure you want to clear all recommendation history?'
        )
      ) {
        clearRecommendations()

        // Clear URL parameters
        window.history.replaceState({}, '', window.location.pathname)
      }
    } catch (error) {
      console.error('Error clearing recommendations:', error)
    }
  }

  const getMediaTypeIcon = (mediaType: 'movie' | 'tv' | 'book') => {
    switch (mediaType) {
      case 'movie':
        return '🎬'
      case 'tv':
        return '📺'
      case 'book':
        return '📚'
    }
  }

  const mediaTypeFilters = [
    { key: 'all', label: 'All', count: recentRecommendations.length },
    {
      key: 'movie',
      label: 'Movies',
      count: recentRecommendations.filter(r => r.mediaType === 'movie').length,
    },
    {
      key: 'tv',
      label: 'TV Shows',
      count: recentRecommendations.filter(r => r.mediaType === 'tv').length,
    },
    {
      key: 'book',
      label: 'Books',
      count: recentRecommendations.filter(r => r.mediaType === 'book').length,
    },
  ] as const

  const headerRightContent = recentRecommendations.length > 0 && (
    <button
      onClick={handleClearAll}
      className="liquid-glass-button relative flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium text-red-400 transition-colors before:bg-red-900/20 hover:text-red-300 hover:before:bg-red-900/30"
    >
      <span className="shine"></span>
      <span className="relative z-10 flex items-center">
        <TrashIcon className="mr-2 h-4 w-4" />
        Clear All
      </span>
    </button>
  )

  return (
    <>
      <PageHeader
        title="History"
        description="Your past recommendations and searches"
        rightContent={headerRightContent}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Filter Tabs */}
          <div className="glass-effect flex space-x-1 rounded-lg bg-gray-900/50 p-1 backdrop-blur-sm">
            {mediaTypeFilters.map(filter => (
              <button
                key={filter.key}
                onClick={() => setSelectedMediaType(filter.key)}
                className={`relative flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  selectedMediaType === filter.key
                    ? 'liquid-glass-button text-white shadow-sm before:bg-red-600/90'
                    : 'liquid-glass-button text-gray-400 before:bg-transparent hover:text-white hover:before:bg-gray-800/50'
                }`}
              >
                <span
                  className={selectedMediaType === filter.key ? 'shine' : ''}
                ></span>
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  <span>{filter.label}</span>
                  <span className="text-xs">({filter.count})</span>
                </div>
              </button>
            ))}
          </div>

          {/* Content */}
          {recentRecommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClockIcon className="mb-4 h-16 w-16 text-gray-600" />
              <h3 className="liquid-glass-text mb-2 text-xl font-medium">
                No recommendation history
                <span className="shine-text"></span>
              </h3>
              <p className="max-w-md text-gray-500">
                Start exploring and getting recommendations to build your
                history. Your past searches and discoveries will appear here.
              </p>
            </div>
          ) : filteredRecommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 text-4xl">
                {getMediaTypeIcon(selectedMediaType as 'movie' | 'tv' | 'book')}
              </div>
              <h3 className="liquid-glass-text mb-2 text-xl font-medium">
                No {selectedMediaType} recommendations found
                <span className="shine-text"></span>
              </h3>
              <p className="text-gray-500">
                Try searching for {selectedMediaType} recommendations to see
                them here.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Recommendation Groups */}
              {filteredRecommendations.map(recommendation => (
                <div
                  key={recommendation.id}
                  className="liquid-glass-card space-y-4 p-6"
                >
                  {/* Group Header */}
                  <div className="flex items-center justify-between border-b border-gray-800/50 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getMediaTypeIcon(recommendation.mediaType)}
                      </div>
                      <div>
                        <h3 className="liquid-glass-text text-lg font-medium">
                          "{recommendation.prompt}"
                          <span className="shine-text"></span>
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(
                            recommendation.timestamp
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          • {recommendation.results.length} recommendation
                          {recommendation.results.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteRecommendation(recommendation.id)
                      }
                      className="liquid-glass-button relative rounded-md p-2 text-gray-400 transition-colors before:bg-transparent hover:text-red-400 hover:before:bg-red-900/20"
                      title="Delete this recommendation"
                    >
                      <span className="shine"></span>
                      <span className="relative z-10">
                        <TrashIcon className="h-5 w-5" />
                      </span>
                    </button>
                  </div>

                  {/* Recommendations */}
                  <RecommendationList
                    recommendations={recommendation.results.map(result => ({
                      ...result,
                      genres: [], // Default empty array for genres
                      length: 0, // Default length
                      mood: [], // Default empty array for mood
                      rating: result.rating || 0, // Ensure rating exists
                    }))}
                    mediaType={recommendation.mediaType}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
