import { cn } from '../../lib/utils'
import { Navigation } from './Navigation'
import { Container } from './Container'

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export function PageLayout({
  children,
  className,
  fullWidth = false,
}: PageLayoutProps) {
  return (
    <div className="relative min-h-screen">
      {/* Animated background */}
      <div className="liquid-glass-bg" />

      {/* Content wrapper with glass effect */}
      <div className="content-overlay">
        <Navigation />
        <main
          className={cn(
            'relative z-10 pt-28', // Account for fixed navigation and ensure content is above background
            className
          )}
        >
          {fullWidth ? children : <Container>{children}</Container>}
        </main>
      </div>
    </div>
  )
}
