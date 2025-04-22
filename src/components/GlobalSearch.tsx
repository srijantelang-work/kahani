import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'
import { useSearch } from '../contexts/SearchContext'
import { useDebounce } from '../hooks/useDebounce'
import { useOnClickOutside } from '../hooks/useOnClickOutside'

export const GlobalSearch = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const searchRef = useRef<HTMLDivElement>(null)

  const {
    recentSearches,
    filters,
    addToHistory,
    removeFromHistory,
    updateFilters,
  } = useSearch()

  useOnClickOutside(searchRef, () => {
    setIsOpen(false)
    setShowFilters(false)
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(true)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    addToHistory(searchQuery)
    setIsOpen(false)

    // Navigate based on filter type
    switch (filters.type) {
      case 'movies':
        navigate(`/movies?q=${encodeURIComponent(searchQuery)}`)
        break
      case 'tv':
        navigate(`/tv?q=${encodeURIComponent(searchQuery)}`)
        break
      case 'books':
        navigate(`/books?q=${encodeURIComponent(searchQuery)}`)
        break
      default:
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="relative" ref={searchRef}>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-500 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
        <span>Search...</span>
        <span className="ml-2 text-xs text-gray-400">⌘K</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5">
          <div className="flex items-center border-b p-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="flex-1 border-0 bg-transparent px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-0"
              autoFocus
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="rounded p-1 hover:bg-gray-100"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {showFilters && (
            <div className="border-b p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <div className="mt-1 flex space-x-2">
                    {(['all', 'movies', 'tv', 'books'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => updateFilters({ type })}
                        className={`rounded-full px-3 py-1 text-sm ${
                          filters.type === type
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Sort by
                  </label>
                  <div className="mt-1 flex space-x-2">
                    {(['relevance', 'date', 'rating'] as const).map(sort => (
                      <button
                        key={sort}
                        onClick={() => updateFilters({ sortBy: sort })}
                        className={`rounded-full px-3 py-1 text-sm ${
                          filters.sortBy === sort
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {sort.charAt(0).toUpperCase() + sort.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto p-2">
            {debouncedQuery && (
              <div className="mb-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500">
                  Press enter to search
                </div>
              </div>
            )}

            {!debouncedQuery && recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500">
                  Recent Searches
                </div>
                {recentSearches.map(item => (
                  <button
                    key={item}
                    onClick={() => handleSearch(item)}
                    className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span>{item}</span>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        removeFromHistory(item)
                      }}
                      className="rounded p-1 hover:bg-gray-200"
                    >
                      <XMarkIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
