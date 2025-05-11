import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerateContentResult,
  SafetyRating,
} from '@google/generative-ai'

export interface GeminiConfig {
  apiKey: string
  model?: string
  temperature?: number
  maxOutputTokens?: number
  topK?: number
  topP?: number
  retryDelay?: number
  maxRetries?: number
}

export interface GeminiSafetyRating {
  category: string
  probability: string
}

export interface GeminiResponse {
  text: string
  safetyRatings: GeminiSafetyRating[]
}

export class GeminiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message)
    this.name = 'GeminiError'
  }
}

export class GeminiClient {
  private genAI: GoogleGenerativeAI
  private model: string
  private config: Partial<GeminiConfig>
  private lastRequestTime: number = 0
  private readonly minRequestInterval: number = 1000 // Minimum 1 second between requests

  constructor(config: GeminiConfig) {
    if (!config.apiKey) {
      throw new GeminiError('API key is required')
    }

    this.genAI = new GoogleGenerativeAI(config.apiKey)
    this.model = config.model || 'gemini-2.0-flash' // Using the latest flash model for improved performance
    this.config = {
      temperature: config.temperature || 0.7,
      maxOutputTokens: config.maxOutputTokens || 1024,
      topK: config.topK || 40,
      topP: config.topP || 0.95,
      retryDelay: config.retryDelay || 2000,
      maxRetries: config.maxRetries || 3,
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime

    if (timeSinceLastRequest < this.minRequestInterval) {
      await this.sleep(this.minRequestInterval - timeSinceLastRequest)
    }

    this.lastRequestTime = Date.now()
  }

  private handleError(error: any): never {
    if (error?.status === 429) {
      throw new GeminiError(
        'Rate limit exceeded. Please try again later.',
        'RATE_LIMIT_EXCEEDED',
        429
      )
    }

    throw new GeminiError(
      error?.message || 'An error occurred while processing your request',
      error?.code || 'UNKNOWN_ERROR',
      error?.status || 500
    )
  }

  private formatResponse(result: GenerateContentResult): GeminiResponse {
    const response = result.response
    return {
      text: response.text(),
      safetyRatings:
        (response as any).safetyRatings?.map((rating: SafetyRating) => ({
          category: rating.category,
          probability: rating.probability,
        })) || [],
    }
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retryCount: number = 0
  ): Promise<T> {
    try {
      await this.enforceRateLimit()
      return await operation()
    } catch (error: any) {
      if (error?.status === 429 && retryCount < (this.config.maxRetries || 3)) {
        const delay = (this.config.retryDelay || 2000) * Math.pow(2, retryCount)
        console.log(`Rate limit hit. Retrying in ${delay}ms...`)
        await this.sleep(delay)
        return this.retryWithBackoff(operation, retryCount + 1)
      }
      throw error
    }
  }

  async generateText(prompt: string): Promise<GeminiResponse> {
    return this.retryWithBackoff(async () => {
      try {
        const model = this.genAI.getGenerativeModel({
          model: this.model,
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
          generationConfig: {
            temperature: this.config.temperature,
            maxOutputTokens: this.config.maxOutputTokens,
            topK: this.config.topK,
            topP: this.config.topP,
          },
        })

        const result = await model.generateContent(prompt)
        return this.formatResponse(result)
      } catch (error) {
        return this.handleError(error)
      }
    })
  }

  async generateChat(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<GeminiResponse> {
    return this.retryWithBackoff(async () => {
      try {
        const model = this.genAI.getGenerativeModel({ model: this.model })
        const chat = model.startChat({
          generationConfig: {
            temperature: this.config.temperature,
            maxOutputTokens: this.config.maxOutputTokens,
            topK: this.config.topK,
            topP: this.config.topP,
          },
        })

        const history = messages.slice(0, -1)
        for (const msg of history) {
          if (msg.role === 'user') {
            await chat.sendMessage(msg.content)
          }
        }

        const lastMessage = messages[messages.length - 1]
        const result = await chat.sendMessage(lastMessage.content)
        return this.formatResponse(result)
      } catch (error) {
        return this.handleError(error)
      }
    })
  }
}
