import React, { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../lib/supabase'
import localforage from 'localforage'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'
import { User } from '../types/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const convertToCustomUser = (supabaseUser: SupabaseUser): User => ({
  ...supabaseUser,
  displayName:
    supabaseUser.user_metadata?.full_name ||
    supabaseUser.email?.split('@')[0] ||
    null,
  photoURL: supabaseUser.user_metadata?.avatar_url || null,
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setUser, setSession, setLoading } = useAuthStore()

  useEffect(() => {
    // Initialize localforage
    localforage.config({
      name: 'auth-storage',
      storeName: 'auth',
    })

    const initializeAuth = async () => {
      try {
        // Check if we have a session in Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          // If there's an error with Supabase, try to get cached session
          const cachedSession = await localforage.getItem<Session>('session')
          if (cachedSession && cachedSession.user) {
            setSession(cachedSession)
            setUser(convertToCustomUser(cachedSession.user))
          }
        } else if (session) {
          setSession(session)
          setUser(convertToCustomUser(session.user))
          // Cache the session for offline use
          await localforage.setItem('session', session)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setSession(session)
        setUser(convertToCustomUser(session.user))
        // Update cached session
        await localforage.setItem('session', session)
      } else {
        setSession(null)
        setUser(null)
        // Clear cached session
        await localforage.removeItem('session')
      }
    })

    initializeAuth()

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setSession, setLoading])

  const contextValue: AuthContextType = {
    user: useAuthStore(state => {
      const user = state.user
      return user ? user : null
    }),
    isAuthenticated: useAuthStore(state => state.isAuthenticated),
    signIn: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
