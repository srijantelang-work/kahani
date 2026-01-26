import { Navigation } from './Navigation'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navigation />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-black px-4 py-8 text-white sm:px-6 lg:px-8 pt-28">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
