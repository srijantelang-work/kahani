import { useState, useEffect } from 'react'

// Genre Definitions
const movieGenres = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Science Fiction',
  'TV Movie',
  'Thriller',
  'War',
  'Western',
]

const tvShowGenres = [
  'Action & Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Kids',
  'Mystery',
  'News',
  'Reality',
  'Sci-Fi & Fantasy',
  'Soap',
  'Talk',
  'War & Politics',
  'Western',
]

const bookGenres = [
  'Fiction',
  'Non-Fiction',
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Historical Fiction',
  'Horror',
  'Biography & Memoir',
  'Self-Help',
  'Philosophy',
  'Psychology',
  'Health & Wellness',
  'Science & Technology',
  'Business & Economics',
  'Poetry',
  'Graphic Novels',
  'Young Adult (YA)',
  "Children's Books",
  'Spirituality & Religion',
  'Travel',
  'Cooking / Food',
  'Art & Photography',
  'Education & Reference',
  'Comics & Manga',
  'Politics & Social Sciences',
]

interface RecommendationPromptProps {
  initialPrompt?: string
  onPromptSubmit: (prompt: string, genres?: string[]) => void
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
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  // Reset genres when media type changes
  useEffect(() => {
    setSelectedGenres([])
  }, [mediaType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      onPromptSubmit(prompt, selectedGenres)
    }
  }

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  const getCurrentGenreList = () => {
    switch (mediaType) {
      case 'movie':
        return movieGenres
      case 'tv':
        return tvShowGenres
      case 'book':
        return bookGenres
      default:
        return []
    }
  }

  const mediaTypes: ('movie' | 'tv' | 'book')[] = ['movie', 'tv', 'book']

  return (
    <div className="w-full max-w-4xl text-center">
      <h1 className="font-poppins text-4xl font-bold text-white">
        WHAT ARE YOU IN THE MOOD FOR TODAY?
      </h1>
      <p className="mt-3 text-xl text-gray-400">
        Describe a vibe, a genre, or a feeling
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <textarea
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={`What kind of ${mediaType} are you looking for?`}
              className="w-full resize-none rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="h-[60px] self-stretch rounded-xl bg-gradient-to-r from-red-600 to-red-800 px-6 py-3 text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Get Recommendations'}
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

        <div className="pt-4">
          <p className="mb-3 text-sm text-gray-500">
            Optionally select preferred genres:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {getCurrentGenreList().map(genre => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreToggle(genre)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  selectedGenres.includes(genre)
                    ? 'border-red-500 bg-red-900/50 text-white'
                    : 'border-gray-700 bg-gray-950 text-gray-400 hover:border-red-600 hover:text-gray-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}
