import { BingoCardWithSquares } from '../../types/bingo'
import { BingoSquare } from './BingoSquare'
import { checkForCompletedLines } from '../../utils/bingoUtils'

interface BingoGridProps {
  card: BingoCardWithSquares
  completedSquares: number[]
  onSquareToggle: (position: number) => void
  disabled?: boolean
}

export const BingoGrid = ({
  card,
  completedSquares,
  onSquareToggle,
  disabled = false,
}: BingoGridProps) => {
  const completedLines = checkForCompletedLines(completedSquares)

  // Create 5x5 grid
  const grid = []
  for (let row = 0; row < 5; row++) {
    const rowSquares = []
    for (let col = 0; col < 5; col++) {
      const position = row * 5 + col + 1
      const square = card.squares.find(s => s.position === position)
      if (square) {
        rowSquares.push(square)
      }
    }
    grid.push(rowSquares)
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Bingo Grid */}
      <div className="grid grid-cols-5 gap-2 rounded-xl border border-gray-700 bg-gray-900 p-4">
        {card.squares
          .sort((a, b) => a.position - b.position)
          .map(square => (
            <BingoSquare
              key={square.id}
              square={square}
              completedSquares={completedSquares}
              onToggle={onSquareToggle}
              disabled={disabled}
            />
          ))}
      </div>

      {/* Completed Lines Overlay */}
      {completedLines.length > 0 && (
        <div className="pointer-events-none absolute inset-0">
          {completedLines.map(line => (
            <div
              key={`${line.type}-${line.index}`}
              className="absolute inset-4"
            >
              {/* Line visualization could be added here */}
              {/* For now, we'll show completion via the squares themselves */}
            </div>
          ))}
        </div>
      )}

      {/* Completion Celebration */}
      {completedLines.length > 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse rounded-lg bg-red-600 px-6 py-3 text-xl font-bold text-white">
            BINGO! 🎉
          </div>
        </div>
      )}
    </div>
  )
}
