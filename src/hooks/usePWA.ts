import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

interface ServiceWorkerRegistration {
  update(): Promise<void>
}

export function usePWA() {
  const {
    offlineReady: _offlineReady,
    needRefresh: _needRefresh,
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered:', r)
    },
    onRegisterError(error: Error) {
      console.log('SW registration error', error)
    },
  })

  const [offlineReady, setOfflineReady] = useState(_offlineReady)
  const [needRefresh, setNeedRefresh] = useState(_needRefresh)

  useEffect(() => {
    setOfflineReady(_offlineReady)
  }, [_offlineReady])

  useEffect(() => {
    setNeedRefresh(_needRefresh)
  }, [_needRefresh])

  const closePrompt = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return {
    offlineReady,
    needRefresh,
    updateServiceWorker,
    closePrompt,
  }
}
