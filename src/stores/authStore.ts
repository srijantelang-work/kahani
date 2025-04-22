import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { User } from '../types/auth'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (isLoading: boolean) => void
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,
      setUser: user => set({ user, isAuthenticated: !!user }),
      setSession: session => set({ session }),
      setLoading: isLoading => set({ isLoading }),
      signInWithGoogle: async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          })
          if (error) throw error
        } catch (error) {
          console.error('Error signing in with Google:', error)
          throw error
        }
      },
      signOut: async () => {
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error
          set({ user: null, session: null, isAuthenticated: false })
        } catch (error) {
          console.error('Error signing out:', error)
          throw error
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
