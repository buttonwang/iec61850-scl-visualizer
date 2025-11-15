import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseUrl, getSupabaseServiceRoleKey } from '@/lib/supabase-safe'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = getServerSupabaseUrl()
    const supabaseServiceRoleKey = getSupabaseServiceRoleKey()
    
    return NextResponse.json({
      message: 'Environment check successful',
      supabaseUrl: supabaseUrl ? 'configured' : 'not configured',
      serviceRoleKey: supabaseServiceRoleKey ? 'configured' : 'not configured',
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json({ 
      error: 'Environment check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}