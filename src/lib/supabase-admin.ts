import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'
import { createMockSupabaseClient, getSupabaseUrl, getSupabaseServiceRoleKey, getSupabaseAnonKey, getServerSupabaseUrl, getServerSupabaseAnonKey } from './supabase-safe'

// 创建真实的Supabase客户端
const createRealSupabaseClient = (url: string, key: string) => {
  return createClient<Database>(url, key)
}

// Admin客户端 - 运行时决定使用真实还是模拟客户端
export const getSupabaseAdmin = () => {
  // 服务端优先使用非公开前缀的环境变量
  const supabaseUrl = getServerSupabaseUrl() || getSupabaseUrl()
  const supabaseServiceRoleKey = getSupabaseServiceRoleKey()
  
  if (supabaseUrl && supabaseServiceRoleKey) {
    return createRealSupabaseClient(supabaseUrl, supabaseServiceRoleKey)
  }
  
  return createMockSupabaseClient() as any
}

// 普通客户端 - 运行时决定使用真实还是模拟客户端  
export const getSupabaseClient = () => {
  const supabaseUrl = getSupabaseUrl()
  const supabaseAnonKey = getSupabaseAnonKey()
  
  if (supabaseUrl && supabaseAnonKey) {
    return createRealSupabaseClient(supabaseUrl, supabaseAnonKey)
  }
  
  return createMockSupabaseClient() as any
}

// 为了向后兼容，也导出直接实例（但推荐使用方法）
export const supabaseAdmin = getSupabaseAdmin()
export const supabase = getSupabaseClient()

export type Tables = Database['public']['Tables']
export type SCLFile = Tables['scl_files']['Row']
export type ParsedData = Tables['parsed_data']['Row']
export type SimulationLog = Tables['simulation_logs']['Row']