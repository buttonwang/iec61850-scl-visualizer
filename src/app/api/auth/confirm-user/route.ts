import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: '邮箱不能为空' }, { status: 400 })
    }

    // 获取运行时Supabase客户端
    const supabaseAdmin = getSupabaseAdmin()
    
    // 获取用户列表
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 })
    }

    // 找到指定邮箱的用户
    const user = users.users.find((u: any) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 确认用户邮箱 - 设置email_verified为true
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { 
        user_metadata: {
          ...user.user_metadata,
          email_verified: true
        }
      }
    )

    if (confirmError) {
      return NextResponse.json({ error: confirmError.message }, { status: 400 })
    }

    return NextResponse.json({
      message: '用户邮箱确认成功',
      user: {
        id: user.id,
        email: user.email,
      }
    })
  } catch (error) {
    console.error('用户确认错误:', error)
    return NextResponse.json({ 
      error: '确认失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}