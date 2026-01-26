import React, { createContext, useContext, useState, ReactNode } from 'react'
import Groq from 'groq-sdk'
import { tmdb } from '../services/tmdb'
import { googleBooks } from '../services/googleBooks'

interface GroqProviderProps {
    apiKey: string
    model?: string
    children: ReactNode
    temperature?: number
    maxTokens?: number
    retryAttempts?: number
    retryDelay?: number
}

interface GroqContextType {
    loading: boolean
    error: GroqError | null
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

interface GroqError {
    message: string
    details?: any
}

const GroqContext = createContext<GroqContextType | undefined>(undefined)

export const GroqProvider: React.FC<GroqProviderProps> = ({
    apiKey,
    model = 'llama-3.3-70b-versatile',
    children,
    temperature = 0.7,
    maxTokens = 1024,
    retryAttempts = 3,
    retryDelay = 1000,
}) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<GroqError | null>(null)

    // Note: dangerouslyAllowBrowser is needed for client-side usage
    // In a production environment, you should route these requests through a backend
    const groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
        baseURL: import.meta.env.DEV ? window.location.origin : 'https://api.groq.com/openai/v1'
    })

    console.log('[GroqContext] Initialized client with baseURL:', groq.baseURL)

    // Common error handler
    const handleGroqError = (err: any) => {
        console.error('Groq API Error:', err)
        let message = 'An unexpected error occurred with the AI agent.'

        if (err.message?.includes('429') || err.message?.includes('Rate limit')) {
            message = 'Rate limit reached. Please wait a moment.'
        } else if (err.message?.includes('401') || err.message?.includes('Authentication')) {
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
        setLoading(true)
        setError(null)

        try {
            let genrePromptPart = ''
            if (genres && genres.length > 0) {
                genrePromptPart = `\nPreferred Genres: ${genres.join(', ')}.`
            }

            // --- Formatting Instructions ---
            let formatInstructions: string
            if (mediaType === 'book') {
                formatInstructions = `Output strictly valid JSON with exactly 4 recommendations in this format:
{
  "recommendations": [
    {
      "title": "Book Title",
      "author": "Author Name",
      "description": "Brief description",
      "reason": "Why suggested",
      "isbn": "ISBN-13 if known"
    }
  ]
}`
            } else {
                formatInstructions = `Output strictly valid JSON with exactly 4 recommendations in this format:
{
  "recommendations": [
    {
      "title": "Title",
      "description": "Brief description",
      "year": 1999,
      "rating": 8.5,
      "reason": "Why suggested"
    }
  ]
}`
            }

            const systemPrompt = `You are a world-class cultural curator and entertainment connoisseur with an encyclopedic knowledge of cinema, television, and literature.
Your mission is to provide deeply curated, eclectic, and versatile recommendations that go beyond the obvious.
- **Eclectic Mix**: Ensure the 4 recommendations are distinct from one another. Aim for a balance of critically acclaimed masterpieces, under-the-radar hidden gems, cult classics, and international hits.
- **Sophisticated Tone**: Use high-level, evocative, and professional vocabulary in your descriptions and reasons (e.g., use words like "visceral," "poignant," "kinetic," "atmospheric").
- **Deep Analysis**: Analyze the user's prompt for subtle emotional and thematic cues.
${formatInstructions}`
            const userMessage = `${prompt} ${genrePromptPart} Return only JSON.`

            console.log('Sending request to Groq API:', { systemPrompt, userMessage })

            let attempt = 0
            let groqRecommendations: any[] = []
            let success = false

            while (attempt < retryAttempts && !success) {
                try {
                    const completion = await groq.chat.completions.create({
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userMessage }
                        ],
                        model: model,
                        temperature: temperature,
                        max_tokens: maxTokens,
                        response_format: { type: 'json_object' } // Force JSON mode
                    })

                    const text = completion.choices[0]?.message?.content || ''
                    console.log('Received response from Groq:', text)

                    const parsedResponse = JSON.parse(text)
                    if (parsedResponse.recommendations && Array.isArray(parsedResponse.recommendations)) {
                        groqRecommendations = parsedResponse.recommendations.slice(0, 4)
                        success = true
                    } else {
                        throw new Error('Invalid JSON structure')
                    }
                } catch (err: any) {
                    console.error(`Attempt ${attempt + 1} failed:`, err)
                    attempt++
                    if (attempt >= retryAttempts) {
                        handleGroqError(err)
                        return []
                    }
                    await new Promise(resolve => setTimeout(resolve, retryDelay))
                }
            }

            if (!success) {
                setLoading(false)
                return []
            }

            // --- Enrichment Logic (TMDB/Google Books) ---
            // Reusing logic from GeminiContext as it is generic
            if (mediaType === 'movie' || mediaType === 'tv') {
                const enrichedRecommendations = await Promise.all(
                    groqRecommendations.map(async rec => {
                        const tmdbResult = await tmdb.searchMedia(rec.title, mediaType, rec.year)
                        if (tmdbResult) {
                            return {
                                ...rec,
                                id: tmdbResult.id,
                                poster_path: tmdbResult.poster_path,
                            }
                        } else {
                            return { ...rec, poster_path: null, id: undefined }
                        }
                    })
                )
                setLoading(false)
                return enrichedRecommendations
            } else if (mediaType === 'book') {
                const enrichedBookRecommendations = await Promise.all(
                    groqRecommendations.map(async rec => {
                        const coverUrl = await googleBooks.searchBookCover(rec.title, rec.author, rec.isbn)
                        return {
                            ...rec,
                            poster_path: coverUrl,
                            id: rec.isbn || `book-${rec.title.replace(/\s+/g, '-')}`,
                        }
                    })
                )
                setLoading(false)
                return enrichedBookRecommendations
            }

            setLoading(false)
            return groqRecommendations
        } catch (err: any) {
            console.error('Error in generatedRecommendations:', err)
            handleGroqError(err)
            return []
        }
    }

    const generateThemes = async (
        mediaType: 'movie' | 'tv' | 'book',
        genres?: string[]
    ): Promise<ThemeOption[]> => {
        setLoading(true)
        setError(null)

        try {
            const genrePart = genres && genres.length > 0 ? ` based on these genres: ${genres.join(', ')}` : ''
            const systemPrompt = `You are a creative curator. Generate exactly 4 creative thematic moods options for ${mediaType}s${genrePart}.
Output strictly valid JSON in this format:
{
  "themes": [
    {
      "name": "Creative Name",
      "description": "Short vibe check",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}`

            const completion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: 'Generate themes now.' }
                ],
                model: model,
                response_format: { type: 'json_object' }
            })

            const text = completion.choices[0]?.message?.content || ''
            const parsed = JSON.parse(text)

            setLoading(false)
            return parsed.themes || []
        } catch (err: any) {
            handleGroqError(err)
            return []
        }
    }

    const generateChatRecommendations = async (chatContext: ChatContext): Promise<any[]> => {
        setLoading(true)
        setError(null)

        try {
            const { mediaType, genres, themes, industry, userPrompt } = chatContext

            const prompt = `I am looking for ${mediaType} recommendations.
Genres: ${genres.join(', ') || 'Any'}
Themes: ${themes.join(', ') || 'Any'}
Industry/Region: ${industry}
${userPrompt ? `Specific Request: "${userPrompt}"` : ''}

Please suggest exactly 4 recommendations that fit this sophisticated vibe.`

            // Reuse standard generation function
            return generateRecommendations(prompt, mediaType, genres)
        } catch (err: any) {
            handleGroqError(err)
            return []
        }
    }

    const value = {
        loading,
        error,
        generateRecommendations,
        generateThemes,
        generateChatRecommendations
    }

    return (
        <GroqContext.Provider value={value}>{children}</GroqContext.Provider>
    )
}

export const useGroqContext = () => {
    const context = useContext(GroqContext)
    if (context === undefined) {
        throw new Error('useGroqContext must be used within a GroqProvider')
    }
    return context
}
