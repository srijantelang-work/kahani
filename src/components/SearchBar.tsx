import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export const SearchBar = () => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-2xl">
      <div className="relative flex-grow">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Try 'Something like Inception but with robots'"
          className="w-full rounded-l-lg border border-gray-700 bg-gray-900 px-4 py-3 pr-10 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center rounded-r-lg bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <span className="ml-2">Discover</span>
      </button>
    </form>
  )
}
