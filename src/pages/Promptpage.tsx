import { useState, useCallback, useEffect } from 'react'
import { Container } from '../components/layout/Container'
import { RecommendationPrompt } from '../components/recommendations/RecommendationPrompt'
import { RecommendationList } from '../components/recommendations/RecommendationList'
import { LoadingMessages } from '../components/ui/LoadingMessages'
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
  const { recentRecommendations } = useRecommendationStore()

  const isLoading = isGenerating || apiLoading

  // Only restore recommendations if there's a stored prompt in the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const storedPrompt = searchParams.get('prompt')
    const storedMediaType = searchParams.get('type') as 'movie' | 'tv' | 'book'

    if (storedPrompt) {
      setPrompt(storedPrompt)
      if (storedMediaType) {
        setMediaType(storedMediaType)
      }

      // Find matching recommendation
      const matchingRecommendation = recentRecommendations.find(
        rec =>
          rec.prompt === storedPrompt &&
          (!storedMediaType || rec.mediaType === storedMediaType)
      )

      if (matchingRecommendation) {
        setRecommendations(matchingRecommendation.results)
      }
    }
  }, [recentRecommendations])

  const handleGenerate = useCallback(
    async (currentPrompt: string) => {
      if (isGenerating) return

      setIsGenerating(true)
      setRecommendations([])

      try {
        const results = await generateRecommendations(currentPrompt, mediaType)

        if (Array.isArray(results) && results.length > 0) {
          setRecommendations(results)

          // Update URL with current prompt and media type
          const searchParams = new URLSearchParams()
          searchParams.set('prompt', currentPrompt.trim())
          searchParams.set('type', mediaType)
          window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${searchParams.toString()}`
          )

          addRecommendation({
            id: Date.now().toString(),
            prompt: currentPrompt.trim(),
            timestamp: new Date().toISOString(),
            mediaType,
            results: results,
          })
        } else {
          console.warn('No valid recommendations received')
        }
      } catch (err) {
        console.error('Error generating recommendations:', err)
        setRecommendations([])
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
        handleGenerate(prompt)
      }
    },
    [prompt, handleGenerate]
  )

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="flex flex-1 items-center justify-center">
        <Container className="mx-auto w-full max-w-4xl px-4">
          <div className="flex flex-col items-center justify-center">
            <RecommendationPrompt
              initialPrompt={prompt}
              onPromptSubmit={handlePromptSubmit}
              mediaType={mediaType}
              onMediaTypeChange={handleMediaTypeChange}
              loading={isLoading}
            />

            {isLoading && (
              <div className="mt-12 flex w-full justify-center">
                <div className="w-full max-w-lg">
                  <LoadingMessages mediaType={mediaType} className="py-8" />
                </div>
              </div>
            )}

            {error && !isLoading && (
              <div className="mt-12 w-full rounded-md bg-red-900/20 p-4 text-center">
                <p className="text-red-400">Error: {error.message}</p>
              </div>
            )}

            {!isLoading && recommendations.length > 0 && (
              <RecommendationList
                recommendations={recommendations}
                mediaType={mediaType}
                className="mt-12 w-full"
              />
            )}
          </div>
        </Container>
      </div>
    </div>
  )
}
