declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      REACT_APP_TMDB_API_KEY?: string
      REACT_APP_GOOGLE_BOOKS_API_KEY?: string
    }
  }
}
