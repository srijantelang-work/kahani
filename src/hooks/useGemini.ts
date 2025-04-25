import { useState, useCallback, useMemo } from 'react'
import { GeminiClient, GeminiError, GeminiResponse } from '../lib/gemini-client'

interface UseGeminiOptions {
  apiKey: string
  model?: string
  temperature?: number
  maxOutputTokens?: number
  retryAttempts?: number
  retryDelay?: number
}

interface UseGeminiState {
  loading: boolean
  error: GeminiError | null
  lastResponse: GeminiResponse | null
}

export const useGemini = (options: UseGeminiOptions) => {
  const [state, setState] = useState<UseGeminiState>({
    loading: false,
    error: null,
    lastResponse: null,
  })

  const client = useMemo(
    () =>
      new GeminiClient({
        apiKey: options.apiKey,
        model: options.model,
        temperature: options.temperature,
        maxOutputTokens: options.maxOutputTokens,
      }),
    [
      options.apiKey,
      options.model,
      options.temperature,
      options.maxOutputTokens,
    ]
  )

  const generateText = useCallback(
    async (prompt: string) => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const retryWithDelay = async <T>(
        fn: () => Promise<T>,
        attempts: number,
        delay: number
      ): Promise<T> => {
        try {
          return await fn()
        } catch (error) {
          if (attempts <= 1) throw error
          await new Promise(resolve => setTimeout(resolve, delay))
          return retryWithDelay(fn, attempts - 1, delay * 1.5)
        }
      }

      try {
        const response = await retryWithDelay(
          () => client.generateText(prompt),
          options.retryAttempts || 3,
          options.retryDelay || 1000
        )

        setState(prev => ({
          ...prev,
          loading: false,
          lastResponse: response,
        }))

        return response
      } catch (error) {
        const geminiError =
          error instanceof GeminiError
            ? error
            : new GeminiError(
                'Failed to generate text',
                'GENERATION_ERROR',
                500
              )

        setState(prev => ({
          ...prev,
          loading: false,
          error: geminiError,
        }))

        throw geminiError
      }
    },
    [client, options.retryAttempts, options.retryDelay]
  )

  const generateChat = useCallback(
    async (
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
    ) => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const retryWithDelay = async <T>(
        fn: () => Promise<T>,
        attempts: number,
        delay: number
      ): Promise<T> => {
        try {
          return await fn()
        } catch (error) {
          if (attempts <= 1) throw error
          await new Promise(resolve => setTimeout(resolve, delay))
          return retryWithDelay(fn, attempts - 1, delay * 1.5)
        }
      }

      try {
        const response = await retryWithDelay(
          () => client.generateChat(messages),
          options.retryAttempts || 3,
          options.retryDelay || 1000
        )

        setState(prev => ({
          ...prev,
          loading: false,
          lastResponse: response,
        }))

        return response
      } catch (error) {
        const geminiError =
          error instanceof GeminiError
            ? error
            : new GeminiError(
                'Failed to generate chat response',
                'CHAT_ERROR',
                500
              )

        setState(prev => ({
          ...prev,
          loading: false,
          error: geminiError,
        }))

        throw geminiError
      }
    },
    [client, options.retryAttempts, options.retryDelay]
  )

  return {
    ...state,
    generateText,
    generateChat,
  }
}
