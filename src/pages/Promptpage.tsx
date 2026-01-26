import { useState } from 'react'
import { Container } from '../components/layout/Container'
import { RecommendationChat } from '../components/recommendations/RecommendationChat'
import { RecommendationList } from '../components/recommendations/RecommendationList'
import { useChatStore } from '../stores/chatStore'
import { useRecommendationStore } from '../stores/recommendationStore'

export const Promptpage = () => {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const { mediaType } = useChatStore()
  const addRecommendation = useRecommendationStore(
    state => state.addRecommendation
  )

  const handleResults = (results: any[]) => {
    setRecommendations(results)
    if (results.length > 0) {
      addRecommendation({
        id: Date.now().toString(),
        prompt: "Interactive Chat Session",
        timestamp: new Date().toISOString(),
        mediaType: mediaType || 'movie',
        results: results,
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="flex flex-1 items-center justify-center py-20">
        <Container className="mx-auto w-full max-w-4xl px-4 flex flex-col items-center">

          <div className="mb-12 text-center space-y-2">
            <h1 className="heading-futuristic text-4xl md:text-5xl bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
              Discovery Agent
            </h1>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-[0.3em]">
              Tell your story, find your vibe
            </p>
          </div>

          <RecommendationChat onResults={handleResults} />

          {recommendations.length > 0 && (
            <div className="mt-20 w-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <RecommendationList
                recommendations={recommendations}
                mediaType={mediaType || 'movie'}
                className="w-full"
              />
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}
