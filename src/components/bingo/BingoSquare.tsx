import { useState } from 'react'
import { BingoSquare as BingoSquareType } from '../../types/bingo'
import { isSquareCompleted } from '../../utils/bingoUtils'

interface BingoSquareProps {
  square: BingoSquareType
  completedSquares: number[]
  onToggle: (position: number) => void
  disabled?: boolean
}

export const BingoSquare = ({
  square,
  completedSquares,
  onToggle,
  disabled = false,
}: BingoSquareProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const isCompleted = isSquareCompleted(square.position, completedSquares)
  const isFreeSpace = square.isFreeSpace

  const handleClick = () => {
    if (!disabled && !isFreeSpace) {
      onToggle(square.position)
    }
  }

  const getSquareClasses = () => {
    const baseClasses =
      'relative flex items-center justify-center p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 min-h-[80px] text-center'

    if (isFreeSpace) {
      return `${baseClasses} bg-yellow-600 border-yellow-500 text-black font-bold cursor-default`
    }

    if (isCompleted) {
      return `${baseClasses} bg-green-600 border-green-500 text-white font-semibold transform scale-95`
    }

    if (isHovered && !disabled) {
      return `${baseClasses} bg-gray-700 border-red-500 text-white transform scale-105`
    }

    return `${baseClasses} bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-red-500 hover:text-white`
  }

  return (
    <div
      className={getSquareClasses()}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={disabled || isFreeSpace ? -1 : 0}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isFreeSpace) {
          e.preventDefault()
          onToggle(square.position)
        }
      }}
    >
      <span className="text-xs leading-tight">{square.description}</span>

      {isCompleted && !isFreeSpace && (
        <div className="absolute right-1 top-1">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-400">
            <svg
              className="h-3 w-3 text-green-900"
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
        </div>
      )}
    </div>
  )
}
