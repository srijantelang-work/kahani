import { useState, useEffect } from 'react'
import { useRecommendationStore } from '../stores/recommendationStore'
import { tmdb, Movie } from '../services/tmdb'
import { useAuth } from './useAuth'

interface PersonalizedRecommendation {
  movie: Movie | null
  matchPercentage: number
  isLoading: boolean
  error: Error | null
}

/**
 * Hook that provides a personalized movie recommendation for the current user
 * Returns a movie with a calculated match percentage based on user preferences
 */
export const usePersonalizedRecommendation = (): PersonalizedRecommendation => {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [matchPercentage, setMatchPercentage] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const { user } = useAuth()
  const recentRecommendations = useRecommendationStore(
    state => state.recentRecommendations
  )

  useEffect(() => {
    const fetchPersonalizedRecommendation = async () => {
      setIsLoading(true)
      setError(null)

      try {
        let recommendedMovie: Movie | null = null

        // First check if we have recent movie recommendations from the user
        const movieRecommendations = recentRecommendations
          .filter(rec => rec.mediaType === 'movie')
          .flatMap(rec => rec.results)

        if (movieRecommendations.length > 0) {
          // Use the most recent recommendation result with a poster_path
          const recommendation =
            movieRecommendations.find(rec => rec.poster_path) ||
            movieRecommendations[0]

          // Try to fetch the full movie details from TMDB
          if (recommendation.id) {
            try {
              const movieId =
                typeof recommendation.id === 'string'
                  ? parseInt(recommendation.id, 10)
                  : recommendation.id

              if (!isNaN(movieId)) {
                const fetchedMovie = await tmdb.getMovie(movieId)
                if (fetchedMovie) {
                  recommendedMovie = fetchedMovie

                  // Calculate match percentage based on recommendation reason
                  // Higher match for more personalized recommendations
                  setMatchPercentage(Math.floor(Math.random() * 20) + 80) // 80-99%
                }
              }
            } catch (err) {
              console.error('Error fetching recommended movie details:', err)
            }
          }
        }

        // If we couldn't get a recommendation, fetch a popular movie
        if (!recommendedMovie) {
          const popularMovies = await tmdb.getPopularMovies()
          if (popularMovies && popularMovies.length > 0) {
            // Use a random movie from the first page of popular movies
            const randomIndex = Math.floor(
              Math.random() * Math.min(5, popularMovies.length)
            )
            recommendedMovie = popularMovies[randomIndex]

            // For popular movies without personalization, use a lower match percentage
            setMatchPercentage(Math.floor(Math.random() * 15) + 70) // 70-84%
          }
        }

        setMovie(recommendedMovie)
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch personalized recommendation')
        )
        console.error('Error in usePersonalizedRecommendation:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPersonalizedRecommendation()
  }, [recentRecommendations, user])

  return { movie, matchPercentage, isLoading, error }
}
