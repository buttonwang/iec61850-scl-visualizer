import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    // 获取运行时Supabase客户端
    const supabaseAdmin = getSupabaseAdmin()
    
    // 获取当前用户
    const { data: { user }, error } = await supabaseAdmin.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      }
    })
  } catch (error) {
    console.error('获取用户信息错误:', error)
    return NextResponse.json({ user: null })
  }
}