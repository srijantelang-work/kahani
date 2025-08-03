import { useState } from 'react'
import { BingoCardWithSquares } from '../../types/bingo'

interface BingoCardSelectorProps {
  cards: BingoCardWithSquares[]
  selectedCard?: BingoCardWithSquares | null
  onCardSelect: (card: BingoCardWithSquares) => void
  category: 'movie' | 'tv'
}

export const BingoCardSelector = ({
  cards,
  selectedCard,
  onCardSelect,
  category,
}: BingoCardSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCards = cards.filter(
    card =>
      card.category === category &&
      (card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.genre.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const genres = [...new Set(filteredCards.map(card => card.genre))]

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={`Search ${category} bingo cards...`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
        />
        <svg
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2">
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setSearchTerm(genre)}
            className="rounded-full bg-gray-700 px-3 py-1 text-sm capitalize text-gray-300 transition-colors hover:bg-red-600 hover:text-white"
          >
            {genre}
          </button>
        ))}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="rounded-full bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-500"
          >
            Clear
          </button>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCards.map(card => (
          <div
            key={card.id}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              selectedCard?.id === card.id
                ? 'border-red-500 bg-red-900/20'
                : 'border-gray-600 bg-gray-800 hover:border-red-400 hover:bg-gray-700'
            }`}
            onClick={() => onCardSelect(card)}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-white">{card.title}</h3>
              {selectedCard?.id === card.id && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="mb-2 text-sm capitalize text-gray-400">
              {card.genre} • {card.category}
            </div>

            {card.description && (
              <p className="mb-3 text-sm text-gray-300">{card.description}</p>
            )}

            {/* Preview of first few squares */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-400">
                Sample squares:
              </div>
              <div className="space-y-1">
                {card.squares.slice(0, 3).map(square => (
                  <div
                    key={square.id}
                    className="truncate text-xs text-gray-300"
                  >
                    • {square.description}
                  </div>
                ))}
                {card.squares.length > 3 && (
                  <div className="text-xs text-gray-400">
                    ...and {card.squares.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="py-8 text-center">
          <div className="mb-2 text-gray-400">No bingo cards found</div>
          <div className="text-sm text-gray-500">
            Try adjusting your search terms or check back later for new cards.
          </div>
        </div>
      )}
    </div>
  )
}
