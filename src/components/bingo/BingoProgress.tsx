interface BingoProgressProps {
  completionPercentage: number
  completedLines: number
  isCompleted: boolean
  onReset?: () => void
  onShare?: () => void
}

export const BingoProgress = ({
  completionPercentage,
  completedLines,
  isCompleted,
  onReset,
  onShare,
}: BingoProgressProps) => {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Progress</h3>
        <div className="flex gap-2">
          {onReset && (
            <button
              onClick={onReset}
              className="rounded bg-gray-700 px-3 py-1 text-sm text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
            >
              Reset
            </button>
          )}
          {onShare && isCompleted && (
            <button
              onClick={onShare}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-500"
            >
              Share
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="mb-2 flex justify-between text-sm text-gray-400">
          <span>Completion</span>
          <span>{completionPercentage}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-700">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : 'bg-red-600'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="rounded-lg bg-gray-800 p-3">
          <div className="text-2xl font-bold text-white">{completedLines}</div>
          <div className="text-sm text-gray-400">
            Line{completedLines !== 1 ? 's' : ''} Complete
          </div>
        </div>
        <div className="rounded-lg bg-gray-800 p-3">
          <div
            className={`text-2xl font-bold ${isCompleted ? 'text-green-400' : 'text-red-400'}`}
          >
            {isCompleted ? 'BINGO!' : 'Playing'}
          </div>
          <div className="text-sm text-gray-400">Status</div>
        </div>
      </div>

      {/* Completion Message */}
      {isCompleted && (
        <div className="mt-4 rounded-lg border border-green-600 bg-green-900/50 p-4">
          <div className="flex items-center">
            <div className="mr-3 text-green-400">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-green-300">
                Congratulations!
              </div>
              <div className="text-sm text-green-200">
                You've completed this bingo card!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
