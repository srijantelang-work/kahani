import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../lib/supabase'
import { Profile, UserPreferences } from '../types/database.types'
import localforage from 'localforage'

interface UseProfileReturn {
  profile: Profile | null
  preferences: UserPreferences | null
  isLoading: boolean
  error: Error | null
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>
}

export const useProfile = (): UseProfileReturn => {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const loadProfile = async () => {
      try {
        // Try to load from cache first
        const cachedProfile = await localforage.getItem<Profile>(
          `profile:${user.id}`
        )
        const cachedPreferences = await localforage.getItem<UserPreferences>(
          `preferences:${user.id}`
        )

        if (cachedProfile) setProfile(cachedProfile)
        if (cachedPreferences) setPreferences(cachedPreferences)

        // Then fetch from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        const { data: preferencesData, error: preferencesError } =
          await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (preferencesError && preferencesError.code !== 'PGRST116') {
          // PGRST116 means no row found, which is fine for new users
          throw preferencesError
        }

        // Update state and cache with fresh data
        if (profileData) {
          setProfile(profileData)
          await localforage.setItem(`profile:${user.id}`, profileData)
        }

        if (preferencesData) {
          setPreferences(preferencesData)
          await localforage.setItem(`preferences:${user.id}`, preferencesData)
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load profile')
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user?.id])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id || !profile) throw new Error('No user profile found')

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)
      await localforage.setItem(`profile:${user.id}`, updatedProfile)
    } catch (err) {
      // Store update in sync log for offline support
      await localforage.setItem(`sync:profile:${Date.now()}`, {
        type: 'profile',
        id: user.id,
        updates,
        timestamp: new Date().toISOString(),
      })
      throw err
    }
  }

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user?.id) throw new Error('No user found')

    try {
      const { error } = await supabase.from('user_preferences').upsert({
        user_id: user.id,
        ...preferences,
        ...updates,
      })

      if (error) throw error

      const updatedPreferences = preferences
        ? { ...preferences, ...updates }
        : ({ id: user.id, user_id: user.id, ...updates } as UserPreferences)

      setPreferences(updatedPreferences)
      await localforage.setItem(`preferences:${user.id}`, updatedPreferences)
    } catch (err) {
      // Store update in sync log for offline support
      await localforage.setItem(`sync:preferences:${Date.now()}`, {
        type: 'preferences',
        user_id: user.id,
        updates,
        timestamp: new Date().toISOString(),
      })
      throw err
    }
  }

  return {
    profile,
    preferences,
    isLoading,
    error,
    updateProfile,
    updatePreferences,
  }
}
