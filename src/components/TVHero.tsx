import { useState, useEffect, useCallback } from 'react'
import { tmdb, Movie } from '../services/tmdb'
import { useRecommendationStore } from '../stores/recommendationStore'

export const TVHero = () => {
    const recentRecommendations = useRecommendationStore(
        state => state.recentRecommendations
    )

    const [movie, setMovie] = useState<Movie | null>(null)
    const [loading, setLoading] = useState(true)
    const [channel, setChannel] = useState(1)

    // Fetch movie on mount
    useEffect(() => {
        let isMounted = true

        const fetchMovie = async () => {
            setLoading(true)
            try {
                let recommendedMovie: Movie | null = null

                // Try recommendations first
                const movieRecommendations = recentRecommendations
                    .filter(rec => rec.mediaType === 'movie')
                    .flatMap(rec => rec.results)

                if (movieRecommendations.length > 0) {
                    const recommendation =
                        movieRecommendations.find(rec => rec.poster_path) ||
                        movieRecommendations[0]

                    if (recommendation.id) {
                        const movieId = typeof recommendation.id === 'string'
                            ? parseInt(recommendation.id, 10)
                            : recommendation.id
                        if (!isNaN(movieId)) {
                            recommendedMovie = await tmdb.getMovie(movieId)
                        }
                    }
                }

                // Fallback to popular
                if (!recommendedMovie) {
                    const popularMovies = await tmdb.getPopularMovies()
                    if (popularMovies && popularMovies.length > 0) {
                        const randomIndex = Math.floor(Math.random() * Math.min(5, popularMovies.length))
                        recommendedMovie = popularMovies[randomIndex]
                    }
                }

                if (isMounted) {
                    setMovie(recommendedMovie)
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error fetching TV movie:', error)
                if (isMounted) setLoading(false)
            }
        }

        fetchMovie()
        return () => { isMounted = false }
    }, [recentRecommendations])

    // Change channel (fetch new movie)
    const changeChannel = useCallback(async () => {
        setLoading(true)
        setChannel(prev => (prev === 99 ? 1 : prev + 1))

        try {
            const popularMovies = await tmdb.getPopularMovies()
            if (popularMovies && popularMovies.length > 0) {
                const randomIndex = Math.floor(Math.random() * popularMovies.length)
                setMovie(popularMovies[randomIndex])
            }
        } catch (error) {
            console.error('Error changing channel:', error)
        }
        setLoading(false)
    }, [])

    return (
        <div className="relative w-full max-w-lg mx-auto perspective-1000">


            {/* TV Casing */}
            <div className="relative bg-[#1a1a1a] rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-t border-white/10 transform transition-transform duration-500 md:rotate-y-[-5deg] md:rotate-x-[2deg]">

                {/* Screen Bezel */}
                <div className="relative bg-black rounded-[2rem] p-2 md:p-3 shadow-inner ring-1 ring-white/5">

                    {/* The Screen Itself */}
                    <div
                        className="relative aspect-[4/3] bg-black rounded-[1.5rem] overflow-hidden group cursor-pointer"
                        onClick={changeChannel}
                    >

                        {/* Screen Content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    {/* Static Noise Effect for Loading */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 animate-flicker"></div>
                                    <div className="text-white/50 font-mono text-xs tracking-widest animate-pulse z-10">NO SIGNAL</div>
                                    <div className="w-16 h-1 bg-white/20 rounded overflow-hidden z-10">
                                        <div className="h-full bg-red-500 w-1/3 animate-pulse"></div>
                                    </div>
                                </div>
                            ) : movie ? (
                                <img
                                    src={tmdb.getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
                                    alt={movie.title}
                                    className="w-full h-full object-cover animate-flicker opacity-90 contrast-125 saturate-110 filter sepia-[0.1]"
                                />
                            ) : (
                                <div className="text-white/30 font-mono text-xs">OFF AIR</div>
                            )}
                        </div>

                        {/* CRT Overlay Effects */}
                        <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] rounded-[1.5rem]"></div>
                        <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20"></div>
                        <div className="absolute top-0 left-0 w-full h-[5px] bg-white/10 opacity-30 animate-scanline z-30 pointer-events-none"></div>

                        {/* Glare */}
                        <div className="absolute -top-[150%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-full opacity-30 pointer-events-none transform rotate-12"></div>

                        {/* Change Channel Hint */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40 bg-black/50 px-2 py-1 rounded text-[10px] text-white font-mono uppercase">
                            Click to Switch
                        </div>

                        {/* Channel Indicator */}
                        <div className="absolute top-4 right-6 text-green-400 font-mono text-xl opacity-60 z-30 pointer-events-none drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
                            CH {channel < 10 ? `0${channel}` : channel}
                        </div>

                        {/* Movie Title Overlay */}
                        {movie && !loading && (
                            <div className="absolute bottom-4 left-4 z-30 max-w-[60%]">
                                <h3 className="font-montserrat text-sm font-bold text-white/90 drop-shadow-lg truncate">{movie.title}</h3>
                                <p className="text-[10px] text-white/60 font-mono uppercase tracking-wider">
                                    NOW PLAYING • {new Date(movie.release_date).getFullYear()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Side Controls Panel */}
                <div className="absolute top-10 -right-4 md:-right-6 w-4 md:w-6 h-32 bg-[#111] rounded-r-lg border-l border-black/50 flex flex-col items-center justify-center gap-2 shadow-lg">
                    <div className="w-1 md:w-2 h-8 bg-[#222] rounded-sm"></div>
                    <div className="w-1 md:w-2 h-8 bg-[#222] rounded-sm"></div>
                    <div className="w-1.5 md:w-2.5 h-1.5 md:h-2.5 bg-red-900 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>

            {/* TV Reflection/Glow on floor */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-3/4 h-10 bg-blue-500/20 blur-[50px] rounded-full opacity-40"></div>
        </div>
    )
}
