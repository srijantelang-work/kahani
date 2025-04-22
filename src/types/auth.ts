import { User as SupabaseUser } from '@supabase/supabase-js'

export interface User extends SupabaseUser {
  displayName: string | null
  photoURL: string | null
}
