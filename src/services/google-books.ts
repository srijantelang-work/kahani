const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
const BASE_URL = 'https://www.googleapis.com/books/v1'

export interface GoogleBook {
  id: string
  volumeInfo: {
    title: string
    subtitle?: string
    authors?: string[]
    publishedDate?: string
    description?: string
    imageLinks?: {
      thumbnail: string
      smallThumbnail: string
    }
    categories?: string[]
    averageRating?: number
    ratingsCount?: number
    language?: string
    pageCount?: number
    publisher?: string
  }
}

export interface GoogleBooksResponse {
  items: GoogleBook[]
  totalItems: number
  kind: string
}

export interface BookSearchOptions {
  maxResults?: number
  startIndex?: number
  orderBy?: 'relevance' | 'newest'
  minRating?: number
  minRatingsCount?: number
  categories?: string[]
  language?: string
}

const popularCategories = [
  'Fiction',
  'Literature',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Biography',
  'History',
  'Science',
]

export const googleBooks = {
  getPopularBooks: async (options: BookSearchOptions = {}) => {
    const {
      maxResults = 8,
      startIndex = 0,
      orderBy = 'relevance',
      minRating = 4,
      minRatingsCount = 100,
      categories = popularCategories,
      language = 'en',
    } = options

    // Create a query that combines multiple categories
    const categoryQuery = categories
      .map(category => `subject:"${category}"`)
      .join(' OR ')

    const params = new URLSearchParams({
      q: `(${categoryQuery})`,
      maxResults: maxResults.toString(),
      startIndex: startIndex.toString(),
      orderBy,
      langRestrict: language,
      key: GOOGLE_BOOKS_API_KEY || '',
      fields: 'items(id,volumeInfo),totalItems,kind',
    })

    const response = await fetch(`${BASE_URL}/volumes?${params.toString()}`)
    const data = (await response.json()) as GoogleBooksResponse

    // Filter results based on rating and ratings count
    return {
      ...data,
      items:
        data.items?.filter(book => {
          const { averageRating = 0, ratingsCount = 0 } = book.volumeInfo
          return averageRating >= minRating && ratingsCount >= minRatingsCount
        }) || [],
    }
  },

  searchBooks: async (query: string, options: BookSearchOptions = {}) => {
    const {
      maxResults = 8,
      startIndex = 0,
      orderBy = 'relevance',
      minRating = 3.5,
      minRatingsCount = 50,
      language = 'en',
    } = options

    const params = new URLSearchParams({
      q: query,
      maxResults: maxResults.toString(),
      startIndex: startIndex.toString(),
      orderBy,
      langRestrict: language,
      key: GOOGLE_BOOKS_API_KEY || '',
      fields: 'items(id,volumeInfo),totalItems,kind',
    })

    const response = await fetch(`${BASE_URL}/volumes?${params.toString()}`)
    const data = (await response.json()) as GoogleBooksResponse

    // Filter results based on rating and ratings count
    return {
      ...data,
      items:
        data.items?.filter(book => {
          const { averageRating = 0, ratingsCount = 0 } = book.volumeInfo
          return averageRating >= minRating && ratingsCount >= minRatingsCount
        }) || [],
    }
  },
}
