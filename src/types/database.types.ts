export type UserTheme = 'light' | 'dark' | 'system'
export type ContentType = 'article' | 'video' | 'book' | 'podcast'
export type ListType = 'watchlist' | 'readinglist'

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  theme: UserTheme
  email_notifications: boolean
  created_at: string
  updated_at: string
  last_sync_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  language: string
  content_filters: Record<string, unknown>
  accessibility_settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface List {
  id: string
  user_id: string
  name: string
  description: string | null
  type: ListType
  is_public: boolean
  created_at: string
  updated_at: string
  last_sync_at: string
  sync_version: number
}

export interface ContentItem {
  id: string
  title: string
  description: string | null
  url: string | null
  thumbnail_url: string | null
  type: ContentType
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ListItem {
  id: string
  list_id: string
  content_id: string
  position: number
  notes: string | null
  is_completed: boolean
  created_at: string
  updated_at: string
  last_sync_at: string
  sync_version: number
}

export interface InteractionHistory {
  id: string
  user_id: string
  content_id: string
  interaction_type: string
  metadata: Record<string, unknown>
  created_at: string
  client_timestamp: string
  sync_status: string
}

export interface SyncLog {
  id: string
  user_id: string
  entity_type: string
  entity_id: string
  operation: string
  payload: Record<string, unknown>
  status: string
  created_at: string
  processed_at: string | null
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at' | 'last_sync_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      user_preferences: {
        Row: UserPreferences
        Insert: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserPreferences, 'id' | 'user_id'>>
      }
      lists: {
        Row: List
        Insert: Omit<
          List,
          'id' | 'created_at' | 'updated_at' | 'last_sync_at' | 'sync_version'
        >
        Update: Partial<Omit<List, 'id' | 'user_id'>>
      }
      content_items: {
        Row: ContentItem
        Insert: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ContentItem, 'id'>>
      }
      list_items: {
        Row: ListItem
        Insert: Omit<
          ListItem,
          'id' | 'created_at' | 'updated_at' | 'last_sync_at' | 'sync_version'
        >
        Update: Partial<Omit<ListItem, 'id' | 'list_id' | 'content_id'>>
      }
      interaction_history: {
        Row: InteractionHistory
        Insert: Omit<InteractionHistory, 'id' | 'created_at'>
        Update: Partial<
          Omit<InteractionHistory, 'id' | 'user_id' | 'content_id'>
        >
      }
      sync_log: {
        Row: SyncLog
        Insert: Omit<SyncLog, 'id' | 'created_at' | 'processed_at'>
        Update: Partial<Omit<SyncLog, 'id' | 'user_id' | 'entity_id'>>
      }
    }
  }
}
