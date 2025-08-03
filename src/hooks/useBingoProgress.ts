import { useState, useEffect } from 'react'
import { UserBingoProgress } from '../types/bingo'
import {
  checkForCompletedLines,
  getCompletionPercentage,
  toggleSquare,
} from '../utils/bingoUtils'

interface UseBingoProgressProps {
  cardId: number
  userId?: string
}

export const useBingoProgress = ({
  cardId,
  userId = 'anonymous',
}: UseBingoProgressProps) => {
  const [progress, setProgress] = useState<UserBingoProgress | null>(null)
  const [loading, setLoading] = useState(true)

  // Load progress from localStorage
  useEffect(() => {
    const loadProgress = () => {
      try {
        const storageKey = `bingo_progress_${userId}_${cardId}`
        const stored = localStorage.getItem(storageKey)

        if (stored) {
          const parsedProgress = JSON.parse(stored) as UserBingoProgress
          setProgress(parsedProgress)
        } else {
          // Create new progress
          const newProgress: UserBingoProgress = {
            id: Date.now(),
            userId,
            cardId,
            completedSquares: [],
            completedLines: 0,
            isCompleted: false,
            startedAt: new Date().toISOString(),
          }
          setProgress(newProgress)
          localStorage.setItem(storageKey, JSON.stringify(newProgress))
        }
      } catch (error) {
        console.error('Failed to load bingo progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [cardId, userId])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (progress) {
      const storageKey = `bingo_progress_${userId}_${cardId}`
      localStorage.setItem(storageKey, JSON.stringify(progress))
    }
  }, [progress, userId, cardId])

  const markSquare = (position: number) => {
    if (!progress) return

    const newCompletedSquares = toggleSquare(
      position,
      progress.completedSquares
    )
    const completedLines = checkForCompletedLines(newCompletedSquares)
    const isCompleted = completedLines.length > 0

    const updatedProgress: UserBingoProgress = {
      ...progress,
      completedSquares: newCompletedSquares,
      completedLines: completedLines.length,
      isCompleted,
      completedAt:
        isCompleted && !progress.isCompleted
          ? new Date().toISOString()
          : progress.completedAt,
    }

    setProgress(updatedProgress)
  }

  const resetProgress = () => {
    if (!progress) return

    const resetProgress: UserBingoProgress = {
      ...progress,
      completedSquares: [],
      completedLines: 0,
      isCompleted: false,
      startedAt: new Date().toISOString(),
      completedAt: undefined,
    }

    setProgress(resetProgress)
  }

  const getCompletionData = () => {
    if (!progress)
      return { percentage: 0, completedLines: [], isCompleted: false }

    const completedLines = checkForCompletedLines(progress.completedSquares)
    return {
      percentage: getCompletionPercentage(progress.completedSquares),
      completedLines,
      isCompleted: progress.isCompleted,
    }
  }

  return {
    progress,
    loading,
    markSquare,
    resetProgress,
    getCompletionData,
  }
}
