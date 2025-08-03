import { useState } from 'react'
import { BingoCardWithSquares } from '../types/bingo'
import { useBingoCards } from '../hooks/useBingoCards'
import { useBingoProgress } from '../hooks/useBingoProgress'
import { BingoCardSelector } from '../components/bingo/BingoCardSelector'
import { BingoGrid } from '../components/bingo/BingoGrid'
import { BingoProgress } from '../components/bingo/BingoProgress'

export const TVShowBingo = () => {
  const [selectedCard, setSelectedCard] = useState<BingoCardWithSquares | null>(
    null
  )
  const { cards, loading: cardsLoading } = useBingoCards()
  const {
    progress,
    loading: progressLoading,
    markSquare,
    resetProgress,
    getCompletionData,
  } = useBingoProgress({
    cardId: selectedCard?.id || 0,
    userId: 'anonymous', // TODO: Use actual user ID from auth
  })

  const tvCards = cards.filter(card => card.category === 'tv')
  const completionData = getCompletionData()

  const handleCardSelect = (card: BingoCardWithSquares) => {
    setSelectedCard(card)
  }

  const handleShare = () => {
    if (selectedCard && completionData.isCompleted) {
      const text = `I just completed "${selectedCard.title}" bingo! 🎉 ${completionData.percentage}% done with ${completionData.completedLines.length} lines completed!`

      if (navigator.share) {
        navigator.share({
          title: 'TV Show Bingo Completed!',
          text: text,
          url: window.location.href,
        })
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text)
        alert('Achievement copied to clipboard!')
      }
    }
  }

  if (cardsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
          <p className="text-sm text-gray-400">
            Loading TV show bingo cards...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">TV Show Bingo</h1>
          <p className="text-lg text-gray-300">
            Track common TV show tropes and patterns while binge-watching your
            favorite series!
          </p>
        </div>

        {!selectedCard ? (
          /* Card Selection */
          <div>
            <h2 className="mb-6 text-2xl font-bold text-white">
              Choose a Bingo Card
            </h2>
            <BingoCardSelector
              cards={tvCards}
              selectedCard={selectedCard}
              onCardSelect={handleCardSelect}
              category="tv"
            />
          </div>
        ) : (
          /* Active Bingo Game */
          <div className="space-y-8">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedCard.title}
                </h2>
                <p className="capitalize text-gray-400">
                  {selectedCard.genre} • {selectedCard.category}
                </p>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="rounded bg-gray-700 px-4 py-2 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
              >
                Change Card
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Bingo Grid */}
              <div className="lg:col-span-2">
                {!progressLoading && progress && (
                  <BingoGrid
                    card={selectedCard}
                    completedSquares={progress.completedSquares}
                    onSquareToggle={markSquare}
                  />
                )}

                {progressLoading && (
                  <div className="flex h-96 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
                  </div>
                )}
              </div>

              {/* Progress Sidebar */}
              <div className="lg:col-span-1">
                {!progressLoading && progress && (
                  <BingoProgress
                    completionPercentage={completionData.percentage}
                    completedLines={completionData.completedLines.length}
                    isCompleted={completionData.isCompleted}
                    onReset={resetProgress}
                    onShare={handleShare}
                  />
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
              <h3 className="mb-3 text-lg font-bold text-white">How to Play</h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  • Click squares when you spot the trope while watching a TV
                  show
                </p>
                <p>
                  • Get 5 squares in a row, column, or diagonal to win BINGO!
                </p>
                <p>
                  • The center square is a FREE space (automatically marked)
                </p>
                <p>• Perfect for binge-watching sessions!</p>
                <p>• Share your completed bingo with friends!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
