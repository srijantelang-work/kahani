import { useState, useEffect } from 'react'
import { useSearchBooks } from '../hooks/useBooks'
import { BookCard } from '../components/BookCard'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { SignalSlashIcon } from '@heroicons/react/24/solid'

export const Books = () => {
  const [startIndex, setStartIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  const {
    data: booksData,
    isLoading,
    isFetching,
    error,
  } = useSearchBooks(debouncedQuery, startIndex)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    // Debounce search query
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value)
      setStartIndex(0)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const totalPages = booksData ? Math.ceil(booksData.totalItems / 12) : 0
  const currentPage = Math.floor(startIndex / 12) + 1

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Books</h1>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search books..."
            />
          </div>
        </div>

        {isOffline && (
          <div className="mt-4 rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <SignalSlashIcon
                  className="h-5 w-5 text-yellow-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Offline Mode
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You are currently offline. Showing cached results. Some
                    features may be limited.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && !isOffline && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Books
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {booksData?.items?.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {booksData && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-4">
                <button
                  onClick={() => setStartIndex(i => Math.max(0, i - 12))}
                  disabled={startIndex === 0 || isFetching || isOffline}
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setStartIndex(i => i + 12)}
                  disabled={
                    currentPage === totalPages || isFetching || isOffline
                  }
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
