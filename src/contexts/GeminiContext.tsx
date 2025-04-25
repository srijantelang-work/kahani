import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  GoogleGenerativeAI,
  GenerationConfig,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai'
import { tmdb } from '../services/tmdb'
import { googleBooks } from '../services/googleBooks'

interface GeminiProviderProps {
  apiKey: string
  model?: string
  children: ReactNode
  temperature?: number
  maxOutputTokens?: number
  retryAttempts?: number
  retryDelay?: number
}

interface GeminiContextType {
  loading: boolean
  error: GeminiError | null
  generateRecommendations: (
    prompt: string,
    mediaType: 'movie' | 'tv' | 'book',
    genres?: string[]
  ) => Promise<any[]>
}

interface GeminiError {
  message: string
  details?: any
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined)

export const GeminiProvider: React.FC<GeminiProviderProps> = ({
  apiKey,
  model = 'gemini-1.5-pro-latest',
  children,
  temperature = 0.7,
  maxOutputTokens = 1024,
  retryAttempts = 3,
  retryDelay = 1000,
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<GeminiError | null>(null)
  let genAI: GoogleGenerativeAI | null = null

  try {
    genAI = new GoogleGenerativeAI(apiKey)
    console.log('Gemini AI initialized with model:', model)
  } catch (err) {
    console.error('Failed to initialize GoogleGenerativeAI:', err)
    setError({
      message: 'Invalid API Key or initialization failed',
      details: err,
    })
  }

  const generationConfig: GenerationConfig = {
    temperature,
    maxOutputTokens,
    topK: 40,
    topP: 0.95,
  }

  const generateRecommendations = async (
    prompt: string,
    mediaType: 'movie' | 'tv' | 'book',
    genres?: string[]
  ): Promise<any[]> => {
    if (!genAI) {
      setError({
        message: 'Gemini AI not initialized. Check API Key.',
      })
      return []
    }

    setLoading(true)
    setError(null)

    try {
      const modelInstance = genAI.getGenerativeModel({
        model,
        generationConfig,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      })

      let genrePromptPart = ''
      if (genres && genres.length > 0) {
        genrePromptPart = `\n\nOptionally consider these preferred genres: ${genres.join(', ')}. If no genres are listed, ignore this part.`
      }

      // --- Adjust prompt based on mediaType ---
      let formatInstructions: string
      if (mediaType === 'book') {
        formatInstructions = `Provide recommendations in the following JSON format only, with no extra text:
{
  "recommendations": [
    {
      "title": "Book Title",
      "author": "Author Name(s)",
      "description": "Brief description of the book",
      "reason": "Why this is recommended based on criteria",
      "isbn": "ISBN (optional, if available)"
    }
  ]
}`
      } else {
        // movie or tv
        formatInstructions = `Provide recommendations in the following JSON format only, with no extra text:
{
  "recommendations": [
    {
      "title": "Title",
      "description": "Brief description",
      "year": 1999, // Year of release or first air date
      "rating": 8.5, // Optional rating
      "reason": "Why this is recommended based on criteria"
    }
  ]
}`
      }

      const fullPrompt = `Generate personalized ${mediaType} recommendations based on the following request: "${prompt}"${genrePromptPart}\n\n${formatInstructions}`

      console.log('Sending request to Gemini API with prompt:', fullPrompt)

      let attempt = 0
      let geminiRecommendations: any[] = []
      let success = false

      while (attempt < retryAttempts && !success) {
        try {
          const chat = modelInstance.startChat({
            history: [],
            generationConfig,
          })

          const result = await chat.sendMessage(fullPrompt)
          const response = await result.response
          let text = response.text()

          console.log('Received response from Gemini API:', text)

          // Extract JSON from potential markdown code block and trim whitespace
          const jsonRegex = /```json\s*([\s\S]*?)\s*```/
          const match = text.match(jsonRegex)
          if (match && match[1]) {
            text = match[1].trim() // Trim whitespace from the extracted JSON string
            console.log('Extracted JSON:', text)
          }

          try {
            const parsedResponse = JSON.parse(text)
            if (
              parsedResponse.recommendations &&
              Array.isArray(parsedResponse.recommendations)
            ) {
              geminiRecommendations = parsedResponse.recommendations
              success = true // Mark as success to exit the retry loop
              console.log(
                'Successfully parsed Gemini recommendations:',
                geminiRecommendations
              )
            } else {
              throw new Error('Invalid JSON structure from API')
            }
          } catch (parseError) {
            console.error(
              'Failed to parse recommendations JSON:',
              parseError,
              'Raw text:',
              text
            )
            throw new Error('Invalid response format from AI')
          }
        } catch (err: any) {
          console.error(`Attempt ${attempt + 1} failed:`, err)
          attempt++
          if (attempt >= retryAttempts) {
            setError({
              message: `Failed to generate recommendations after ${retryAttempts} attempts.`,
              details: err.message || err,
            })
            setLoading(false)
            return [] // Return empty on final failure
          }
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
      }

      if (!success) {
        console.error('Exited retry loop without success.')
        setLoading(false)
        return []
      }

      // --- Fetch TMDB details for Movies/TV ---
      if (mediaType === 'movie' || mediaType === 'tv') {
        console.log('Fetching TMDB details for recommendations...')
        const enrichedRecommendations = await Promise.all(
          geminiRecommendations.map(async rec => {
            const tmdbResult = await tmdb.searchMedia(
              rec.title,
              mediaType,
              rec.year
            )
            if (tmdbResult) {
              console.log(`Found TMDB match for ${rec.title}:`, tmdbResult)
              return {
                ...rec, // Keep original Gemini data (description, reason)
                id: tmdbResult.id, // Use TMDB ID
                poster_path: tmdbResult.poster_path, // Use TMDB poster path
                // Optionally overwrite rating/year if TMDB is preferred
                // rating: tmdbResult.vote_average,
                // year: mediaType === 'movie' ? tmdbResult.release_date?.split('-')[0] : tmdbResult.first_air_date?.split('-')[0],
              }
            } else {
              console.warn(`No TMDB match found for ${rec.title} (${rec.year})`)
              return {
                ...rec,
                poster_path: null, // Ensure poster_path is null if no match
                id: undefined, // Ensure id is undefined
              }
            }
          })
        )
        console.log('Enriched recommendations:', enrichedRecommendations)
        setLoading(false)
        return enrichedRecommendations
      } else if (mediaType === 'book') {
        // --- Fetch Google Books covers for Books ---
        console.log('Fetching Google Books covers for recommendations...')
        const enrichedBookRecommendations = await Promise.all(
          geminiRecommendations.map(async rec => {
            const coverUrl = await googleBooks.searchBookCover(
              rec.title,
              rec.author, // Pass author
              rec.isbn // Pass ISBN
            )
            console.log(`Google Books cover search for ${rec.title}:`, coverUrl)
            return {
              ...rec,
              poster_path: coverUrl, // Add poster_path (can be null)
              id: rec.isbn || `book-${rec.title.replace(/\s+/g, '-')}`, // Generate a pseudo-ID if ISBN is missing
            }
          })
        )
        console.log(
          'Enriched book recommendations:',
          enrichedBookRecommendations
        )
        setLoading(false)
        return enrichedBookRecommendations
      } else {
        // For any other types (if added later), return Gemini results directly
        console.warn(
          `Unhandled mediaType ${mediaType}, returning raw recommendations.`
        )
        setLoading(false)
        return geminiRecommendations
      }
    } catch (err: any) {
      console.error('Error in generateRecommendations (outer try-catch): ', err)
      setError({
        message: 'Failed to generate recommendations',
        details: err.message || err,
      })
      setLoading(false)
      return []
    }
  }

  const value = {
    loading,
    error,
    generateRecommendations,
  }

  return (
    <GeminiContext.Provider value={value}>{children}</GeminiContext.Provider>
  )
}

export const useGeminiContext = () => {
  const context = useContext(GeminiContext)
  if (context === undefined) {
    throw new Error('useGeminiContext must be used within a GeminiProvider')
  }
  return context
}
