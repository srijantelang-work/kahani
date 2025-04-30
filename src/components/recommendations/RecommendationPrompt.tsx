import { useState } from 'react'

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      onPromptSubmit(prompt)
    }
  }

  const mediaTypes: ('movie' | 'tv' | 'book')[] = ['movie', 'tv', 'book']

  return (
    <div className="flex w-full flex-col items-center justify-center text-center">
      <h1 className="font-poppins text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
        WHAT ARE YOU IN THE MOOD FOR TODAY?
      </h1>
      <p className="mt-4 text-xl text-gray-400">
        Describe a vibe, a genre, or a feeling
      </p>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-2xl space-y-6">
        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={`What kind of ${mediaType} are you looking for?`}
            className="w-full resize-none rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 pr-32 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="absolute bottom-3 right-3 rounded-lg bg-gradient-to-r from-red-600 to-red-800 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="flex justify-center gap-4">
          {mediaTypes.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => onMediaTypeChange(type)}
              className={`rounded-full px-5 py-1.5 text-sm font-medium transition ${
                mediaType === type
                  ? 'bg-red-600 text-white shadow-md'
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
