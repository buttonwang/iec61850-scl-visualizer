import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 })
    }

    // 获取运行时Supabase客户端
    const supabaseAdmin = getSupabaseAdmin()
    
    // 用户登录
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: '登录失败' }, { status: 401 })
    }

    return NextResponse.json({
      message: '登录成功',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      }
    })
  } catch (error) {
    console.error('用户登录错误:', error)
    return NextResponse.json({ 
      error: '登录失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}