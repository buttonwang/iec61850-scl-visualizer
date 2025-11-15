import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    // 获取运行时Supabase客户端
    const supabaseAdmin = getSupabaseAdmin()
    
    // 用户登出
    const { error } = await supabaseAdmin.auth.signOut()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: '登出成功' })
  } catch (error) {
    console.error('用户登出错误:', error)
    return NextResponse.json({ 
      error: '登出失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}