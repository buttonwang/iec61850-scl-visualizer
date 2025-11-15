// Mock Supabase client for build time when environment variables are not available
export const createMockSupabaseClient = () => ({
  auth: {
    signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    signOut: () => Promise.resolve({ error: new Error('Supabase not configured') }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    admin: {
      listUsers: () => Promise.resolve({ data: { users: [] }, error: null }),
      updateUserById: () => Promise.resolve({ data: null, error: null })
    }
  },
  from: () => ({
    select: () => ({ data: null, error: new Error('Supabase not configured') }),
    insert: () => ({ data: null, error: new Error('Supabase not configured') }),
    update: () => ({ data: null, error: new Error('Supabase not configured') }),
    delete: () => ({ data: null, error: new Error('Supabase not configured') })
  })
})

// Runtime environment variable access - only evaluated when actually used
export const getSupabaseUrl = () => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  }
  if (typeof window !== 'undefined' && (window as any).ENV) {
    return (window as any).ENV.NEXT_PUBLIC_SUPABASE_URL || ''
  }
  return ''
}

export const getSupabaseAnonKey = () => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  }
  if (typeof window !== 'undefined' && (window as any).ENV) {
    return (window as any).ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  }
  return ''
}

export const getSupabaseServiceRoleKey = () => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  }
  return ''
}

// 服务端专用：优先使用非公开前缀的环境变量
export const getServerSupabaseUrl = () => {
  if (typeof process !== 'undefined' && process.env) {
    // 服务端优先使用非公开前缀的变量，如果未设置则回退到公开前缀
    return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  }
  return ''
}

export const getServerSupabaseAnonKey = () => {
  if (typeof process !== 'undefined' && process.env) {
    // 服务端优先使用非公开前缀的变量，如果未设置则回退到公开前缀
    return process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  }
  return ''
}

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()
  return !!(url && key)
}