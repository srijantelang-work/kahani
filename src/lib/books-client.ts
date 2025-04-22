import axios from 'axios'
import { GOOGLE_BOOKS_API_URL } from '../config/api'

if (!process.env.REACT_APP_GOOGLE_BOOKS_API_KEY) {
  console.warn('Google Books API key is not set. Some features may be limited.')
}

export const booksClient = axios.create({
  baseURL: GOOGLE_BOOKS_API_URL,
  params: {
    key: process.env.REACT_APP_GOOGLE_BOOKS_API_KEY,
  },
})

// Add response interceptor for error handling
booksClient.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.error?.message || 'An error occurred'
    console.error('Google Books API Error:', message)
    return Promise.reject(error)
  }
)
