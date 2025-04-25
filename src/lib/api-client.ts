import axios, { AxiosResponse, AxiosError } from 'axios'
import { TMDB_BASE_URL } from '../config/api'

interface TMDBErrorResponse {
  message: string
  status_code?: number
}

// Get API key from the appropriate environment variable source
const API_KEY =
  import.meta.env?.VITE_TMDB_API_KEY ||
  import.meta.env?.REACT_APP_TMDB_API_KEY ||
  window.__RUNTIME_CONFIG__?.REACT_APP_TMDB_API_KEY

if (!API_KEY) {
  console.error('TMDB API key is not defined in environment variables')
}

export const apiClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
})

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<TMDBErrorResponse>) => {
    const message = error.response?.data?.message || 'An error occurred'
    console.error('API Error:', message)
    return Promise.reject(error)
  }
)
