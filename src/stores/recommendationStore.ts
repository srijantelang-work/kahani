import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RecommendationResult {
  id?: string | number
  title: string
  description: string
  reason: string
  year?: number
  rating?: number
  poster_path?: string
  author?: string // For books
  isbn?: string // For books
}

export interface Recommendation {
  id: string
  prompt: string
  timestamp: string
  mediaType: 'movie' | 'tv' | 'book'
  results: RecommendationResult[]
}

interface RecommendationState {
  recentRecommendations: Recommendation[]
  addRecommendation: (
    recommendation: Omit<Recommendation, 'id'> & { id?: string }
  ) => void
  deleteRecommendation: (id: string) => void
  clearRecommendations: () => void
  getRecommendationById: (id: string) => Recommendation | undefined
}

export const useRecommendationStore = create<RecommendationState>()(
  persist(
    (set, get) => ({
      recentRecommendations: [],

      addRecommendation: recommendation => {
        const id = recommendation.id || Date.now().toString()
        set(state => {
          // Remove any existing recommendation with the same prompt and media type
          const filteredRecommendations = state.recentRecommendations.filter(
            rec =>
              !(
                rec.prompt === recommendation.prompt &&
                rec.mediaType === recommendation.mediaType
              )
          )

          return {
            recentRecommendations: [
              { ...recommendation, id },
              ...filteredRecommendations,
            ].slice(0, 10), // Keep only the 10 most recent recommendations
          }
        })
      },

      deleteRecommendation: (id: string) => {
        set(state => ({
          recentRecommendations: state.recentRecommendations.filter(
            rec => rec.id !== id
          ),
        }))
      },

      clearRecommendations: () => set({ recentRecommendations: [] }),

      getRecommendationById: (id: string) => {
        const state = get()
        return state.recentRecommendations.find(rec => rec.id === id)
      },
    }),
    {
      name: 'recommendations-storage',
      version: 1,
    }
  )
)
