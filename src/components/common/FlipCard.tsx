import { ReactNode } from 'react'

interface FlipCardProps {
  front: ReactNode
  back: ReactNode
  className?: string
  glass?: boolean
}

export const FlipCard = ({
  front,
  back,
  className = '',
  glass = false,
}: FlipCardProps) => {
  return (
    <div
      className={`flip-card-container relative h-full w-full ${className} ${glass ? 'liquid-glass-card' : ''}`}
    >
      <div className="flip-card relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 h-full w-full [backface-visibility:hidden]">
          {front}
        </div>

        {/* Back */}
        <div className="absolute inset-0 h-full w-full overflow-hidden rounded-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
      {glass && <div className="shine-effect"></div>}
    </div>
  )
}
