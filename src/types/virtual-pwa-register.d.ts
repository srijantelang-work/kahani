declare module 'virtual:pwa-register/react' {
  interface RegisterSWOptions {
    onRegistered?(registration: ServiceWorkerRegistration | undefined): void
    onRegisterError?(error: Error): void
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: boolean
    offlineReady: boolean
    updateServiceWorker: () => Promise<void>
  }
}
