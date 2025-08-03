export interface BingoCard {
  id: number
  title: string
  category: 'movie' | 'tv'
  genre: string
  description?: string
  isActive: boolean
  createdAt: string
}

export interface BingoSquare {
  id: number
  cardId: number
  position: number // 1-25 for grid position
  description: string
  isFreeSpace: boolean
}

export interface UserBingoProgress {
  id: number
  userId: string
  cardId: number
  completedSquares: number[]
  completedLines: number
  isCompleted: boolean
  startedAt: string
  completedAt?: string
}

export interface BingoCardWithSquares extends BingoCard {
  squares: BingoSquare[]
}

export interface BingoProgress {
  card: BingoCardWithSquares
  progress: UserBingoProgress
}

export type BingoLineType = 'row' | 'column' | 'diagonal'

export interface BingoLine {
  type: BingoLineType
  index: number
  positions: number[]
}

export interface BingoDetectionRule {
  [key: string]: string[]
}

export interface BingoDetectionRules {
  [genre: string]: BingoDetectionRule
}
