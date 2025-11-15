import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type Tables = Database['public']['Tables']
export type SCLFile = Tables['scl_files']['Row']
export type ParsedData = Tables['parsed_data']['Row']
export type SimulationLog = Tables['simulation_logs']['Row']