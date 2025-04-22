import { usePWA } from '@/hooks/usePWA'
import { Button } from '../ui/button'

export function UpdatePrompt() {
  const { offlineReady, needRefresh, updateServiceWorker, closePrompt } =
    usePWA()

  if (!offlineReady && !needRefresh) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 p-4 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        <p className="text-sm">
          {offlineReady
            ? 'App ready to work offline'
            : 'New content available, click on reload button to update'}
        </p>
        <div className="flex gap-2">
          {needRefresh && (
            <Button onClick={() => updateServiceWorker()}>Reload</Button>
          )}
          <Button variant="ghost" onClick={() => closePrompt()}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
