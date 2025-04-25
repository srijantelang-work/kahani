import { useState, useCallback } from 'react'
import { useGeminiContext } from '../contexts/GeminiContext'

export type MediaType = 'movie' | 'book' | 'tv'
export type Mood = 'happy' | 'sad' | 'excited' | 'relaxed' | 'thoughtful'
export type Genre =
  | 'action'
  | 'comedy'
  | 'drama'
  | 'horror'
  | 'romance'
  | 'sci-fi'
  | 'thriller'
  | 'documentary'

interface RecommendationFilters {
  mediaType: MediaType
  mood?: Mood
  genres?: Genre[]
  excludeHistory?: boolean
  minRating?: number
  maxLength?: number
}

interface RecommendationItem {
  title: string
  type: MediaType
  description: string
  genres: Genre[]
  rating: number
  length: number
  mood: Mood[]
  reason: string
}

export const useRecommendations = () => {
  const { generateText } = useGeminiContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const generatePrompt = (
    filters: RecommendationFilters,
    history: string[]
  ): string => {
    let prompt = `Generate personalized ${filters.mediaType} recommendations based on the following criteria:\n`

    if (filters.mood) {
      prompt += `\nMood: ${filters.mood}`
    }

    if (filters.genres?.length) {
      prompt += `\nGenres: ${filters.genres.join(', ')}`
    }

    if (filters.minRating) {
      prompt += `\nMinimum Rating: ${filters.minRating}`
    }

    if (filters.maxLength) {
      prompt += `\nMaximum Length: ${filters.maxLength} minutes`
    }

    if (filters.excludeHistory && history.length > 0) {
      prompt += `\nExclude these titles: ${history.join(', ')}`
    }

    prompt += `\n\nProvide recommendations in the following JSON format:
    {
      "recommendations": [
        {
          "title": "Title",
          "description": "Brief description",
          "genres": ["genre1", "genre2"],
          "rating": 8.5,
          "length": 120,
          "mood": ["mood1", "mood2"],
          "reason": "Why this is recommended based on criteria"
        }
      ]
    }`

    return prompt
  }

  const getRecommendations = useCallback(
    async (
      filters: RecommendationFilters,
      history: string[] = []
    ): Promise<RecommendationItem[]> => {
      setLoading(true)
      setError(null)

      try {
        const prompt = generatePrompt(filters, history)
        const response = await generateText(prompt)

        try {
          const data = JSON.parse(response.text)
          return data.recommendations
        } catch (parseError) {
          throw new Error('Failed to parse recommendations')
        }
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'))
        return []
      } finally {
        setLoading(false)
      }
    },
    [generateText]
  )

  const getMoodBasedPrompt = (mood: Mood): string => {
    const moodPrompts = {
      happy: 'Looking for something uplifting and joyful',
      sad: 'Need something comforting or cathartic',
      excited: 'In the mood for something thrilling and energetic',
      relaxed: 'Want something calm and easy-going',
      thoughtful: 'Interested in something deep and meaningful',
    }

    return moodPrompts[mood]
  }

  const getGenreBasedPrompt = (genres: Genre[]): string => {
    return `Looking for ${genres.join(' or ')} content`
  }

  return {
    getRecommendations,
    getMoodBasedPrompt,
    getGenreBasedPrompt,
    loading,
    error,
  }
}
