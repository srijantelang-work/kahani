import { useState } from 'react'
import { Container } from '../components/layout/Container'
import { RecommendationPrompt } from '../components/recommendations/RecommendationPrompt'
import { RecommendationList } from '../components/recommendations/RecommendationList'
import { useGeminiContext } from '../contexts/GeminiContext'
import { useRecommendationStore } from '../stores/recommendationStore'

export const Promptpage = () => {
  const [prompt, setPrompt] = useState('')
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [mediaType, setMediaType] = useState<'movie' | 'tv' | 'book'>('movie')
  const { generateRecommendations, loading, error } = useGeminiContext()
  const addRecommendation = useRecommendationStore(
    state => state.addRecommendation
  )

  const handleGenerate = async (currentPrompt: string, genres?: string[]) => {
    setRecommendations([])
    try {
      const results = await generateRecommendations(
        currentPrompt,
        mediaType,
        genres
      )
      setRecommendations(results)

      // Add to recent recommendations
      addRecommendation({
        id: Date.now().toString(),
        prompt: currentPrompt.trim(),
        timestamp: new Date().toISOString(),
        // Add results if you want to store them
      })
    } catch (err) {
      console.error('Error generating recommendations:', err)
      // Handle error display in UI if needed
    }
  }

  const handlePromptSubmit = (submittedPrompt: string, genres?: string[]) => {
    setPrompt(submittedPrompt)
    handleGenerate(submittedPrompt, genres)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black py-12 text-white">
      <Container className="flex flex-col items-center justify-center">
        <RecommendationPrompt
          initialPrompt={prompt}
          onPromptSubmit={handlePromptSubmit}
          mediaType={mediaType}
          onMediaTypeChange={setMediaType}
          loading={loading}
        />

        {loading && (
          <div className="mt-12 flex w-full justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="mt-12 w-full rounded-md bg-red-900/20 p-4 text-center">
            <p className="text-red-400">Error: {error.message}</p>
          </div>
        )}

        {!loading && recommendations.length > 0 && (
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
