import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 获取当前用户信息 - 使用相对路径避免硬编码localhost
    const baseUrl = new URL(request.url).origin
    const response = await fetch(`${baseUrl}/api/auth/user`)
    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return NextResponse.json({ user: null })
  }
}