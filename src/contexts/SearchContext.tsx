import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react'

interface SearchState {
  searchHistory: string[]
  filters: {
    type: 'all' | 'movies' | 'tv' | 'books'
    sortBy: 'relevance' | 'date' | 'rating'
    genre?: string
    year?: number
  }
  recentSearches: string[]
}

type SearchAction =
  | { type: 'ADD_TO_HISTORY'; payload: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'UPDATE_FILTERS'; payload: Partial<SearchState['filters']> }
  | { type: 'REMOVE_FROM_HISTORY'; payload: string }

const initialState: SearchState = {
  searchHistory: [],
  filters: {
    type: 'all',
    sortBy: 'relevance',
  },
  recentSearches: [],
}

const searchReducer = (
  state: SearchState,
  action: SearchAction
): SearchState => {
  switch (action.type) {
    case 'ADD_TO_HISTORY':
      const newHistory = [action.payload, ...state.searchHistory.slice(0, 9)]
      return {
        ...state,
        searchHistory: Array.from(new Set(newHistory)),
        recentSearches: Array.from(
          new Set([action.payload, ...state.recentSearches.slice(0, 4)])
        ),
      }
    case 'CLEAR_HISTORY':
      return {
        ...state,
        searchHistory: [],
        recentSearches: [],
      }
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      }
    case 'REMOVE_FROM_HISTORY':
      return {
        ...state,
        searchHistory: state.searchHistory.filter(
          item => item !== action.payload
        ),
        recentSearches: state.recentSearches.filter(
          item => item !== action.payload
        ),
      }
    default:
      return state
  }
}

interface SearchContextType extends SearchState {
  addToHistory: (query: string) => void
  clearHistory: () => void
  updateFilters: (filters: Partial<SearchState['filters']>) => void
  removeFromHistory: (query: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState)

  const addToHistory = useCallback((query: string) => {
    if (query.trim()) {
      dispatch({ type: 'ADD_TO_HISTORY', payload: query.trim() })
      // Store in localStorage
      try {
        const history = JSON.parse(
          localStorage.getItem('searchHistory') || '[]'
        )
        localStorage.setItem(
          'searchHistory',
          JSON.stringify([query.trim(), ...history.slice(0, 9)])
        )
      } catch (error) {
        console.error('Failed to save search history:', error)
      }
    }
  }, [])

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' })
    localStorage.removeItem('searchHistory')
  }, [])

  const updateFilters = useCallback(
    (filters: Partial<SearchState['filters']>) => {
      dispatch({ type: 'UPDATE_FILTERS', payload: filters })
    },
    []
  )

  const removeFromHistory = useCallback((query: string) => {
    dispatch({ type: 'REMOVE_FROM_HISTORY', payload: query })
    try {
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      localStorage.setItem(
        'searchHistory',
        JSON.stringify(history.filter((item: string) => item !== query))
      )
    } catch (error) {
      console.error('Failed to remove from search history:', error)
    }
  }, [])

  return (
    <SearchContext.Provider
      value={{
        ...state,
        addToHistory,
        clearHistory,
        updateFilters,
        removeFromHistory,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
