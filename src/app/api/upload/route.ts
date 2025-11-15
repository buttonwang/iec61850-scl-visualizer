import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 })
    }

    // 验证文件类型
    if (!file.name.endsWith('.cid') && !file.name.endsWith('.icd') && !file.name.endsWith('.scd')) {
      return NextResponse.json({ error: '不支持的文件类型，请上传.cid、.icd或.scd文件' }, { status: 400 })
    }

    // 读取文件内容
    const fileContent = await file.text()
    
    // 上传到Supabase存储
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('scl-files')
      .upload(`${Date.now()}-${file.name}`, file, {
        contentType: file.type || 'application/xml',
      })

    if (uploadError) {
      return NextResponse.json({ error: '文件上传失败' }, { status: 500 })
    }

    // 获取文件URL
    const { data: { publicUrl } } = supabase.storage
      .from('scl-files')
      .getPublicUrl(uploadData.path)

    return NextResponse.json({
      message: '文件上传成功',
      fileName: file.name,
      fileSize: file.size,
      fileUrl: publicUrl,
      fileContent: fileContent.substring(0, 1000), // 返回前1000个字符用于预览
    })
  } catch (error) {
    console.error('文件上传错误:', error)
    return NextResponse.json({ error: '文件处理失败' }, { status: 500 })
  }
}