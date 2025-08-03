import { useState, useEffect } from 'react'
import { BingoCardWithSquares } from '../types/bingo'
import { ALL_BINGO_CARDS } from '../data/bingoCards'
import { filterCardsByCategory, filterCardsByGenre } from '../utils/bingoUtils'

export const useBingoCards = () => {
  const [cards, setCards] = useState<BingoCardWithSquares[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setLoading(true)
      // Simulate loading from API
      setTimeout(() => {
        setCards(ALL_BINGO_CARDS)
        setLoading(false)
      }, 100)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load bingo cards'
      )
      setLoading(false)
    }
  }, [])

  const getCardsByCategory = (category: 'movie' | 'tv') => {
    return filterCardsByCategory(cards, category)
  }

  const getCardsByGenre = (genre: string) => {
    return filterCardsByGenre(cards, genre)
  }

  const getCardById = (id: number) => {
    return cards.find(card => card.id === id) || null
  }

  return {
    cards,
    loading,
    error,
    getCardsByCategory,
    getCardsByGenre,
    getCardById,
  }
}
