import { cn } from '@/lib/utils'
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
    <div className="min-h-screen bg-background">
      <Navigation />
      <main
        className={cn(
          'pt-16', // Account for fixed navigation
          className
        )}
      >
        {fullWidth ? children : <Container>{children}</Container>}
      </main>
    </div>
  )
}
