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

  constructor(config: GeminiConfig) {
    if (!config.apiKey) {
      throw new GeminiError('API key is required')
    }

    this.genAI = new GoogleGenerativeAI(config.apiKey)
    this.model = config.model || 'gemini-1.5-pro-latest'
    this.config = {
      temperature: config.temperature || 0.7,
      maxOutputTokens: config.maxOutputTokens || 1024,
      topK: config.topK || 40,
      topP: config.topP || 0.95,
    }
  }

  private async handleError(error: any): Promise<never> {
    if (error instanceof GeminiError) {
      throw error
    }

    const message = error.message || 'An error occurred with the Gemini API'
    const code = error.code || 'UNKNOWN_ERROR'
    const status = error.status || 500

    throw new GeminiError(message, code, status)
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

  async generateText(prompt: string): Promise<GeminiResponse> {
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
  }

  async generateChat(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<GeminiResponse> {
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
  }
}
