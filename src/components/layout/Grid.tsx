import { cn } from '@/lib/utils'

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 2 | 4 | 6 | 8
}

export function Grid({
  children,
  className,
  cols = 1,
  gap = 4,
  ...props
}: GridProps) {
  const getGridCols = () => {
    switch (cols) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'grid-cols-1 sm:grid-cols-2'
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      case 6:
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
      case 12:
        return 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-12'
      default:
        return 'grid-cols-1'
    }
  }

  return (
    <div
      className={cn('grid', getGridCols(), `gap-${gap}`, className)}
      {...props}
    >
      {children}
    </div>
  )
}
