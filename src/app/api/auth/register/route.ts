import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '密码长度至少为6位' }, { status: 400 })
    }

    // 获取运行时Supabase客户端
    const supabaseAdmin = getSupabaseAdmin()
    
    // 调试信息
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '已配置' : '未配置')
    console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '已配置' : '未配置')
    
    // 用户注册
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: '注册失败' }, { status: 400 })
    }

    // Supabase Auth已经管理用户信息，不需要额外插入到users表

    return NextResponse.json({
      message: '注册成功',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      }
    })
  } catch (error) {
    console.error('用户注册错误:', error)
    return NextResponse.json({ 
      error: '注册失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}