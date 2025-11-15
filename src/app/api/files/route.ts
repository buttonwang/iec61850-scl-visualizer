import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!userId) {
      return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 })
    }

    // 获取运行时Supabase客户端
    const supabaseAdmin = getSupabaseAdmin()
    
    // 查询用户的SCL文件列表
    const { data: files, error } = await supabaseAdmin
      .from('scl_files')
      .select(`
        *,
        parsed_data (
          id,
          created_at,
          version,
          parsing_status
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('查询文件列表错误:', error)
      return NextResponse.json({ error: '查询文件列表失败' }, { status: 500 })
    }

    return NextResponse.json({
      message: '文件列表查询成功',
      files: files || [],
      total: files?.length || 0,
    })
  } catch (error) {
    console.error('获取文件列表错误:', error)
    return NextResponse.json({ 
      error: '获取文件列表失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')
    const userId = searchParams.get('userId')

    if (!fileId || !userId) {
      return NextResponse.json({ error: '文件ID和用户ID不能为空' }, { status: 400 })
    }

    // 获取运行时Supabase客户端
    const supabaseAdmin = getSupabaseAdmin()
    
    // 首先验证文件所有权
    const { data: file, error: checkError } = await supabaseAdmin
      .from('scl_files')
      .select('id')
      .eq('id', fileId)
      .eq('user_id', userId)
      .single()

    if (checkError || !file) {
      return NextResponse.json({ error: '文件不存在或无权限' }, { status: 404 })
    }

    // 注意：由于数据库类型不匹配，暂时跳过存储删除
    // TODO: 在数据库类型更新后恢复存储删除功能

    // 删除相关的解析数据
    const { error: parseDeleteError } = await supabaseAdmin
      .from('parsed_data')
      .delete()
      .eq('file_id', fileId)

    if (parseDeleteError) {
      console.error('解析数据删除错误:', parseDeleteError)
    }

    // 删除相关的模拟日志
    const { error: logDeleteError } = await supabaseAdmin
      .from('simulation_logs')
      .delete()
      .eq('file_id', fileId)

    if (logDeleteError) {
      console.error('模拟日志删除错误:', logDeleteError)
    }

    // 删除文件记录
    const { error: fileDeleteError } = await supabaseAdmin
      .from('scl_files')
      .delete()
      .eq('id', fileId)
      .eq('user_id', userId)

    if (fileDeleteError) {
      console.error('文件记录删除错误:', fileDeleteError)
      return NextResponse.json({ error: '文件删除失败' }, { status: 500 })
    }

    return NextResponse.json({
      message: '文件删除成功',
      fileId,
    })
  } catch (error) {
    console.error('删除文件错误:', error)
    return NextResponse.json({ 
      error: '删除文件失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}