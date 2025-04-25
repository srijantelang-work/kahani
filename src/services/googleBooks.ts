import axios from 'axios'

interface BookVolumeInfo {
  title: string
  authors?: string[]
  imageLinks?: {
    smallThumbnail?: string
    thumbnail?: string
  }
  // Add other fields if needed
}

interface BookVolume {
  id: string
  volumeInfo: BookVolumeInfo
}

interface GoogleBooksApiResponse {
  totalItems: number
  items?: BookVolume[]
}

/**
 * Searches the Google Books API for a book cover image.
 * Tries searching by ISBN first, then by title and author as a fallback.
 *
 * @param title The title of the book.
 * @param author The author of the book (optional).
 * @param isbn The ISBN of the book (optional).
 * @returns The URL of the thumbnail image, or null if not found.
 */
export const searchBookCover = async (
  title: string,
  author?: string,
  isbn?: string
): Promise<string | null> => {
  let query = ''

  // Prioritize ISBN search if available
  if (isbn) {
    // Clean ISBN: remove hyphens and spaces
    const cleanedIsbn = isbn.replace(/[-\s]/g, '')
    query = `isbn:${cleanedIsbn}`
  } else if (title) {
    query = `intitle:${encodeURIComponent(title)}`
    if (author) {
      query += `+inauthor:${encodeURIComponent(author)}`
    }
  } else {
    console.warn('Cannot search Google Books without title or ISBN.')
    return null
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1` // Get only the top result
  console.log(`Searching Google Books API: ${url}`)

  try {
    const response = await axios.get<GoogleBooksApiResponse>(url)
    const data = response.data

    if (data.totalItems > 0 && data.items && data.items[0]) {
      const volumeInfo = data.items[0].volumeInfo
      // Prefer thumbnail, fallback to smallThumbnail
      const coverUrl =
        volumeInfo.imageLinks?.thumbnail ||
        volumeInfo.imageLinks?.smallThumbnail
      if (coverUrl) {
        // Google Books returns HTTP URLs, ensure HTTPS
        return coverUrl.replace(/^http:\/\//, 'https://')
      } else {
        console.log(`No imageLinks found for "${title}"`)
        return null
      }
    } else {
      console.log(`No Google Books results found for query: ${query}`)
      return null
    }
  } catch (error) {
    console.error('Error searching Google Books API:', error)
    return null
  }
}

export const googleBooks = {
  searchBookCover,
}
