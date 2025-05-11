import { useState, useCallback } from 'react'
import { Container } from '../components/layout/Container'
import { RecommendationPrompt } from '../components/recommendations/RecommendationPrompt'
import { RecommendationList } from '../components/recommendations/RecommendationList'
import { useGeminiContext } from '../contexts/GeminiContext'
import { useRecommendationStore } from '../stores/recommendationStore'

export const Promptpage = () => {
  const [prompt, setPrompt] = useState('')
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [mediaType, setMediaType] = useState<'movie' | 'tv' | 'book'>('movie')
  const [isGenerating, setIsGenerating] = useState(false)
  const {
    generateRecommendations,
    loading: apiLoading,
    error,
  } = useGeminiContext()
  const addRecommendation = useRecommendationStore(
    state => state.addRecommendation
  )

  const handleGenerate = useCallback(
    async (currentPrompt: string) => {
      if (isGenerating) return // Prevent multiple simultaneous generations

      setIsGenerating(true)
      try {
        const results = await generateRecommendations(currentPrompt, mediaType)

        // Only update recommendations if we got valid results
        if (Array.isArray(results) && results.length > 0) {
          setRecommendations(results)

          // Add to recent recommendations
          addRecommendation({
            id: Date.now().toString(),
            prompt: currentPrompt.trim(),
            timestamp: new Date().toISOString(),
            mediaType,
            results: results, // Store the actual results
          })
        } else {
          console.warn('No valid recommendations received')
        }
      } catch (err) {
        console.error('Error generating recommendations:', err)
        setRecommendations([]) // Clear recommendations on error
      } finally {
        setIsGenerating(false)
      }
    },
    [generateRecommendations, mediaType, addRecommendation, isGenerating]
  )

  const handlePromptSubmit = useCallback(
    (submittedPrompt: string) => {
      setPrompt(submittedPrompt)
      handleGenerate(submittedPrompt)
    },
    [handleGenerate]
  )

  const handleMediaTypeChange = useCallback(
    (newMediaType: 'movie' | 'tv' | 'book') => {
      setMediaType(newMediaType)
      if (prompt) {
        // Regenerate recommendations when media type changes with existing prompt
        handleGenerate(prompt)
      }
    },
    [prompt, handleGenerate]
  )

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-black">
      <Container className="mx-auto max-w-4xl px-4">
        <RecommendationPrompt
          initialPrompt={prompt}
          onPromptSubmit={handlePromptSubmit}
          mediaType={mediaType}
          onMediaTypeChange={handleMediaTypeChange}
          loading={isGenerating || apiLoading}
        />

        {(isGenerating || apiLoading) && (
          <div className="mt-12 flex w-full justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
          </div>
        )}

        {error && !isGenerating && (
          <div className="mt-12 w-full rounded-md bg-red-900/20 p-4 text-center">
            <p className="text-red-400">Error: {error.message}</p>
          </div>
        )}

        {!isGenerating && !apiLoading && recommendations.length > 0 && (
          <RecommendationList
            recommendations={recommendations}
            mediaType={mediaType}
            className="mt-12 w-full"
          />
        )}
      </Container>
    </div>
  )
}
