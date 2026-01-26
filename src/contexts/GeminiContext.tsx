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
  generateThemes: (
    mediaType: 'movie' | 'tv' | 'book',
    genres?: string[]
  ) => Promise<ThemeOption[]>
  generateChatRecommendations: (
    context: ChatContext
  ) => Promise<any[]>
}

export interface ThemeOption {
  name: string
  keywords: string[]
  description: string
}

export interface ChatContext {
  mediaType: 'movie' | 'tv' | 'book'
  genres: string[]
  themes: string[]
  industry: 'bollywood' | 'hollywood' | 'both'
  directors: string[]
  userPrompt?: string
}

interface GeminiError {
  message: string
  details?: any
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined)

export const GeminiProvider: React.FC<GeminiProviderProps> = ({
  apiKey,
  model = 'gemini-3-pro-preview',
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

  const handleGeminiError = (err: any) => {
    console.error('Gemini API Error:', err)
    let message = 'An unexpected error occurred with the AI agent.'

    if (err.message?.includes('429') || err.message?.includes('quota')) {
      message = 'The AI agent is a bit busy right now (Rate Limit). Please wait a few seconds and try again!'
    } else if (err.message?.includes('404') || err.message?.includes('not found')) {
      message = `Model "${model}" not found or unsupported. Please check your API configuration.`
    } else if (err.message?.includes('API key')) {
      message = 'Invalid API key. Please check your settings.'
    }

    setError({ message, details: err })
    setLoading(false)
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
        formatInstructions = `Provide exactly 4 recommendations in the following JSON format only, with no extra text:
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
        formatInstructions = `Provide exactly 4 recommendations in the following JSON format only, with no extra text:
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

      const fullPrompt = `Generate exactly 4 personalized ${mediaType} recommendations based on the following request: "${prompt}"${genrePromptPart}\n\n${formatInstructions}`

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
            text = match[1].trim()
            console.log('Extracted JSON:', text)
          }

          try {
            const parsedResponse = JSON.parse(text)
            if (
              parsedResponse.recommendations &&
              Array.isArray(parsedResponse.recommendations)
            ) {
              // Ensure exactly 4 recommendations
              geminiRecommendations = parsedResponse.recommendations.slice(0, 4)
              success = true
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
            handleGeminiError(err)
            return []
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

  const generateThemes = async (
    mediaType: 'movie' | 'tv' | 'book',
    genres?: string[]
  ): Promise<ThemeOption[]> => {
    if (!genAI) return []
    setLoading(true)
    setError(null)

    try {
      const modelInstance = genAI.getGenerativeModel({
        model,
        generationConfig,
      })

      const genrePart =
        genres && genres.length > 0
          ? ` based on these genres: ${genres.join(', ')}`
          : ''
      const prompt = `Generate exactly 4 creative and unique thematic moods/options for ${mediaType}s${genrePart}. 
Each theme should have a 'name' (a catchy phrase like 'Small Town Mysteries' or 'Mind-Bending Time Travel'), 
a 'description' (one sentence vibe), and a list of 'keywords' (3-5 conceptual keywords that represent it). 
Provide the response in this JSON format:
{
  "themes": [
    {
      "name": "Theme Name",
      "description": "Short vibe description",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}`

      const result = await modelInstance.generateContent(prompt)
      const response = await result.response
      let text = response.text()

      // Simple extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        setLoading(false)
        return parsed.themes || []
      }
      setLoading(false)
      return []
    } catch (err: any) {
      handleGeminiError(err)
      return []
    }
  }

  const generateChatRecommendations = async (
    chatContext: ChatContext
  ): Promise<any[]> => {
    if (!genAI) return []
    setLoading(true)
    setError(null)

    try {
      const { mediaType, genres, themes, industry, userPrompt } = chatContext

      // 1. Get Keyword IDs from TMDB if it's not a book
      let keywordIds: number[] = []
      if (mediaType !== 'book') {
        const allKeywords = themes.flatMap(t => t.split(' ')) // Simple fallback if we don't have granular keywords yet
        // In a real implementation, we'd iterate and call tmdb.searchKeyword
        // For now, let's let Gemini handle the "Concept" and we search for them
      }

      // 2. Powerful Prompt for Gemini to curate based on all inputs
      const fullContextPrompt = `I am looking for ${mediaType} recommendations.
Genres: ${genres.join(', ') || 'Any'}
Themes: ${themes.join(', ') || 'Any'}
Industry/Region: ${industry}
${userPrompt ? `Specific Request: "${userPrompt}"` : ''}

Please suggest exactly 5 recommendations that fit this sophisticated vibe.
Provide the response in high-quality JSON format as defined earlier.`

      // Re-use the existing generation logic with this new prompt
      // (For brevity in this edit, I'm defining the new logic but in practice I'd refactor the common parsing)
      return generateRecommendations(fullContextPrompt, mediaType, genres)
    } catch (err: any) {
      handleGeminiError(err)
      return []
    }
  }

  const value = {
    loading,
    error,
    generateRecommendations,
    generateThemes,
    generateChatRecommendations,
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
