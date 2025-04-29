import React, { useEffect, useCallback } from 'react'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../lib/supabase'
import localforage from 'localforage'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'
import { User } from '../types/auth'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
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

const clearAuthState = async () => {
  const promises = [
    localforage.removeItem('session'),
    localforage.removeItem('user'),
    // Add any other auth-related items that need clearing
  ]
  await Promise.all(promises)
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setUser, setSession, setLoading } = useAuthStore()
  const navigate = useNavigate()

  const validateAndSetSession = useCallback(
    async (session: Session | null) => {
      if (!session) {
        await clearAuthState()
        setSession(null)
        setUser(null)
        return false
      }

      // Check if session is expired
      const isExpired = new Date(session.expires_at! * 1000) < new Date()
      if (isExpired) {
        await clearAuthState()
        setSession(null)
        setUser(null)
        return false
      }

      setSession(session)
      setUser(convertToCustomUser(session.user))
      return true
    },
    [setSession, setUser]
  )

  useEffect(() => {
    localforage.config({
      name: 'auth-storage',
      storeName: 'auth',
    })

    const initializeAuth = async () => {
      try {
        setLoading(true)

        // First try to get Supabase session
        const {
          data: { session },
          error: supabaseError,
        } = await supabase.auth.getSession()

        if (session) {
          // If we have a valid Supabase session, use it
          const isValid = await validateAndSetSession(session)
          if (isValid) {
            await localforage.setItem('session', session)
            return
          }
        }

        // If no valid Supabase session, try cached session
        if (supabaseError || !session) {
          const cachedSession = await localforage.getItem<Session>('session')
          if (cachedSession) {
            const isValid = await validateAndSetSession(cachedSession)
            if (!isValid) {
              await clearAuthState()
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        await clearAuthState()
      } finally {
        setLoading(false)
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const isValid = await validateAndSetSession(session)
        if (isValid) {
          await localforage.setItem('session', session)
        }
      } else {
        await clearAuthState()
      }
    })

    initializeAuth()

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setSession, setLoading, validateAndSetSession])

  const signOut = async () => {
    try {
      // First, clear all local state
      await clearAuthState()
      setUser(null)
      setSession(null)

      // Then attempt to sign out from Supabase
      try {
        const { error } = await supabase.auth.signOut()
        if (error && !error.message.includes('Auth session missing')) {
          console.error('Non-critical sign out error:', error)
        }
      } catch (supabaseError) {
        console.error('Supabase sign out error:', supabaseError)
        // Continue with navigation even if Supabase sign out fails
      }

      // Always navigate to landing page
      navigate('/landing', { replace: true })
    } catch (error) {
      console.error('Error during sign out:', error)
      // Ensure navigation happens even if there's an error
      navigate('/landing', { replace: true })
    }
  }

  const contextValue: AuthContextType = {
    user: useAuthStore(state => state.user ?? null),
    isAuthenticated: useAuthStore(state => state.isAuthenticated),
    signIn: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    },
    signOut,
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
