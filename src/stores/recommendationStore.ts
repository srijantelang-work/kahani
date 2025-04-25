import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Recommendation {
  id: string
  prompt: string
  timestamp: string
  results?: any[] // Replace with proper type based on your recommendation data structure
}

interface RecommendationState {
  recentRecommendations: Recommendation[]
  addRecommendation: (recommendation: Recommendation) => void
  clearRecommendations: () => void
}

export const useRecommendationStore = create<RecommendationState>()(
  persist(
    set => ({
      recentRecommendations: [],
      addRecommendation: recommendation =>
        set(state => ({
          recentRecommendations: [
            recommendation,
            ...state.recentRecommendations,
          ].slice(0, 10), // Keep only the 10 most recent recommendations
        })),
      clearRecommendations: () => set({ recentRecommendations: [] }),
    }),
    {
      name: 'recommendations-storage',
    }
  )
)
