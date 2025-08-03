import { BingoLine, BingoLineType } from '../types/bingo'

export const BINGO_LINES: BingoLine[] = [
  // Rows
  { type: 'row', index: 0, positions: [1, 2, 3, 4, 5] },
  { type: 'row', index: 1, positions: [6, 7, 8, 9, 10] },
  { type: 'row', index: 2, positions: [11, 12, 13, 14, 15] },
  { type: 'row', index: 3, positions: [16, 17, 18, 19, 20] },
  { type: 'row', index: 4, positions: [21, 22, 23, 24, 25] },

  // Columns
  { type: 'column', index: 0, positions: [1, 6, 11, 16, 21] },
  { type: 'column', index: 1, positions: [2, 7, 12, 17, 22] },
  { type: 'column', index: 2, positions: [3, 8, 13, 18, 23] },
  { type: 'column', index: 3, positions: [4, 9, 14, 19, 24] },
  { type: 'column', index: 4, positions: [5, 10, 15, 20, 25] },

  // Diagonals
  { type: 'diagonal', index: 0, positions: [1, 7, 13, 19, 25] },
  { type: 'diagonal', index: 1, positions: [5, 9, 13, 17, 21] },
]

export const checkForCompletedLines = (
  completedSquares: number[]
): BingoLine[] => {
  const completedLines: BingoLine[] = []

  // Always include center square (13) as completed since it's free
  const allCompleted = [...completedSquares, 13]

  for (const line of BINGO_LINES) {
    const isLineComplete = line.positions.every(position =>
      allCompleted.includes(position)
    )

    if (isLineComplete) {
      completedLines.push(line)
    }
  }

  return completedLines
}

export const isBingoComplete = (completedSquares: number[]): boolean => {
  const completedLines = checkForCompletedLines(completedSquares)
  return completedLines.length > 0
}

export const getCompletionPercentage = (completedSquares: number[]): number => {
  // 24 squares total (excluding center free space)
  return Math.round((completedSquares.length / 24) * 100)
}

export const getGridPosition = (
  position: number
): { row: number; col: number } => {
  const row = Math.floor((position - 1) / 5)
  const col = (position - 1) % 5
  return { row, col }
}

export const getPositionFromGrid = (row: number, col: number): number => {
  return row * 5 + col + 1
}

export const isSquareCompleted = (
  position: number,
  completedSquares: number[]
): boolean => {
  return position === 13 || completedSquares.includes(position) // Center is always completed
}

export const toggleSquare = (
  position: number,
  completedSquares: number[]
): number[] => {
  if (position === 13) return completedSquares // Can't toggle free space

  const isCompleted = completedSquares.includes(position)

  if (isCompleted) {
    return completedSquares.filter(sq => sq !== position)
  } else {
    return [...completedSquares, position].sort((a, b) => a - b)
  }
}

export const getBingoLineClass = (
  lineType: BingoLineType,
  index: number
): string => {
  const baseClass = 'absolute pointer-events-none'

  switch (lineType) {
    case 'row':
      return `${baseClass} bingo-line-row-${index}`
    case 'column':
      return `${baseClass} bingo-line-col-${index}`
    case 'diagonal':
      return `${baseClass} bingo-line-diagonal-${index}`
    default:
      return baseClass
  }
}

export const getRandomBingoCard = <T>(cards: T[]): T | null => {
  if (cards.length === 0) return null
  const randomIndex = Math.floor(Math.random() * cards.length)
  return cards[randomIndex]
}

export const filterCardsByCategory = <T extends { category: string }>(
  cards: T[],
  category: string
): T[] => {
  return cards.filter(card => card.category === category)
}

export const filterCardsByGenre = <T extends { genre: string }>(
  cards: T[],
  genre: string
): T[] => {
  return cards.filter(card => card.genre === genre)
}
