import movieCardGif from '@/assets/auth/moviecard.gif'

export const LoginIllustrations = () => {
  return (
    <div className="relative h-full w-full">
      {/* Left Section with GIF and Text Overlay */}
      <div className="relative h-full w-full">
        <img
          src={movieCardGif}
          alt="Movie Card Animation"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center bg-black/40 p-12">
          <h1 className="font-heading text-6xl leading-tight text-white">
            YOUR VIBE.
            <br />
            YOUR STORY.
            <br />
            <span className="kahani-brand">KAHANI</span>
          </h1>
          <p className="mt-4 max-w-md font-body text-xl text-gray-200">
            Discover Your Next Favorite Show or Movie or Book
          </p>
        </div>
      </div>
    </div>
  )
}
