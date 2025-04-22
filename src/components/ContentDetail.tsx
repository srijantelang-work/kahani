import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

interface ContentDetailProps {
  title: string
  subtitle?: string
  releaseDate?: string
  rating?: number
  ratingCount?: number
  posterImage?: string
  backdropImage?: string
  overview?: string
  genres?: string[]
  additionalInfo?: React.ReactNode
  loading?: boolean
}

export const ContentDetail = ({
  title,
  subtitle,
  releaseDate,
  rating,
  ratingCount,
  posterImage,
  backdropImage,
  overview,
  genres,
  additionalInfo,
  loading,
}: ContentDetailProps) => {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="relative h-[400px] w-full bg-gray-200 lg:h-[500px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-32 flex gap-6 pb-12">
            <div className="hidden aspect-[2/3] w-64 rounded-lg bg-gray-200 lg:block" />
            <div className="flex-1 space-y-4">
              <div className="h-8 w-2/3 rounded bg-gray-200" />
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-5/6 rounded bg-gray-200" />
                <div className="h-4 w-4/6 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/75" />
        {backdropImage && (
          <img
            src={backdropImage}
            alt={title}
            className="h-[400px] w-full object-cover lg:h-[500px]"
          />
        )}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-32 flex gap-6 pb-12">
          {posterImage && (
            <div className="hidden lg:block">
              <img
                src={posterImage}
                alt={title}
                className="aspect-[2/3] w-64 rounded-lg object-cover shadow-xl"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white lg:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <h2 className="mt-2 text-xl text-gray-300">{subtitle}</h2>
            )}

            {(releaseDate || rating) && (
              <div className="mt-4 flex items-center gap-4 text-gray-300">
                {releaseDate && <span>{releaseDate}</span>}
                {rating && (
                  <div className="flex items-center gap-1">
                    <span>★ {rating.toFixed(1)}</span>
                    {ratingCount && (
                      <span className="text-sm">({ratingCount} ratings)</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {genres && genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {genres.map(genre => (
                  <span
                    key={genre}
                    className="rounded-full bg-gray-800 px-3 py-1 text-sm text-white"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {overview && (
              <p className="mt-6 text-lg leading-relaxed text-white">
                {overview}
              </p>
            )}

            {additionalInfo && (
              <div className="mt-8 text-white">{additionalInfo}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
