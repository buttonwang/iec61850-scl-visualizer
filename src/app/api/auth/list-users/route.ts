import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    // 获取运行时Supabase客户端
    const supabaseAdmin = getSupabaseAdmin()
    
    // 获取所有用户
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      users: users.users.map((user: any) => ({
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata
      }))
    })
  } catch (error) {
    console.error('获取用户列表错误:', error)
    return NextResponse.json({ 
      error: '获取用户列表失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}