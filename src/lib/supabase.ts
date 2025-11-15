import { createClient } from '@supabase/supabase-js'
import { createMockSupabaseClient, getSupabaseUrl, getSupabaseAnonKey } from './supabase-safe'

// Create client using runtime environment variables
const supabaseUrl = getSupabaseUrl()
const supabaseAnonKey = getSupabaseAnonKey()

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient() as any