import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { List } from '../types/database.types'
import { PlusIcon } from '@heroicons/react/24/outline'

export const Lists = () => {
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('lists')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        setLists(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lists')
      } finally {
        setLoading(false)
      }
    }

    fetchLists()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">My Lists</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New List
          </button>
        </div>

        {lists.length === 0 ? (
          <div className="mt-6 rounded-lg border-2 border-dashed border-gray-700 p-12 text-center">
            <p className="text-lg text-gray-400">
              You haven't created any lists yet.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating a new list to organize your favorite
              movies, TV shows, and books.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map(list => (
              <div
                key={list.id}
                onClick={() => navigate(`/lists/${list.id}`)}
                className="cursor-pointer rounded-lg bg-gray-800 p-6 shadow-sm transition-all hover:bg-gray-700"
              >
                <h3 className="text-lg font-medium text-white">{list.name}</h3>
                {list.description && (
                  <p className="mt-2 text-sm text-gray-400">
                    {list.description}
                  </p>
                )}
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                  <span>
                    {list.type === 'watchlist' ? 'Watch List' : 'Reading List'}
                  </span>
                  <span>•</span>
                  <span>{list.is_public ? 'Public' : 'Private'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
