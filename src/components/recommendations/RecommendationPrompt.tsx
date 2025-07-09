import { useState, useEffect } from 'react'

interface RecommendationPromptProps {
  initialPrompt?: string
  onPromptSubmit: (prompt: string) => void
  mediaType: 'movie' | 'tv' | 'book'
  onMediaTypeChange: (type: 'movie' | 'tv' | 'book') => void
  loading: boolean
}

export const RecommendationPrompt = ({
  initialPrompt = '',
  onPromptSubmit,
  mediaType,
  onMediaTypeChange,
  loading,
}: RecommendationPromptProps) => {
  const [prompt, setPrompt] = useState(initialPrompt)

  // Update prompt when initialPrompt changes (from URL)
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt)
    }
  }, [initialPrompt])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      onPromptSubmit(prompt)
    }
  }

  const mediaTypes: ('movie' | 'tv' | 'book')[] = ['movie', 'tv', 'book']

  return (
    <div className="flex w-full flex-col items-center justify-center text-center">
      <p className="text-elegant mt-6 text-xl text-gray-300 md:text-2xl">
        Describe a vibe, a genre, or a feeling
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-12 w-full max-w-2xl space-y-8"
      >
        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={`What kind of ${mediaType} are you looking for?`}
            className="text-modern w-full resize-none rounded-xl border border-gray-700 bg-gray-950/80 px-6 py-4 pr-32 text-lg text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="heading-futuristic absolute bottom-3 right-3 rounded-lg bg-gradient-to-r from-red-600 to-red-800 px-6 py-2.5 text-base font-bold text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="flex justify-center gap-6">
          {mediaTypes.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => onMediaTypeChange(type)}
              className={`text-modern rounded-full px-6 py-2 text-base font-bold tracking-wide transition ${
                mediaType === type
                  ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              {type === 'tv'
                ? 'TV Shows'
                : type === 'movie'
                  ? 'Movies'
                  : type === 'book'
                    ? 'Books'
                    : type}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}
