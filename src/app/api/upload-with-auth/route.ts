import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { SCLParser, ParsedSCL } from '@/lib/scl-parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const projectName = formData.get('projectName') as string || '未命名项目'
    
    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 })
    }

    // 验证文件类型
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!['cid', 'icd', 'scd'].includes(fileExtension || '')) {
      return NextResponse.json({ error: '不支持的文件类型' }, { status: 400 })
    }

    // 读取文件内容
    const fileContent = await file.text()
    
    // 解析SCL文件
    const parser = new SCLParser()
    let parsedData: ParsedSCL
    
    try {
      const validation = parser.validateSCLFile(fileContent)
      if (!validation.isValid) {
        return NextResponse.json({ 
          error: 'SCL文件验证失败', 
          details: validation.errors 
        }, { status: 400 })
      }
      
      parsedData = await parser.parseSCLFile(fileContent, file.name)
    } catch (error) {
      return NextResponse.json({ 
        error: 'SCL文件解析失败', 
        details: error instanceof Error ? error.message : '未知错误'
      }, { status: 400 })
    }

    // 简化处理：直接使用项目名作为标识
    const projectNameClean = projectName.replace(/[^a-zA-Z0-9-_]/g, '_');

    // 获取运行时Supabase客户端
    const supabaseAdmin = getSupabaseAdmin()
    
    // 上传到Supabase存储
    const fileName = `${userId}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('scl-files')
      .upload(fileName, file, {
        contentType: file.type || 'application/xml',
        metadata: {
          originalName: file.name,
          userId,
          projectName,
        }
      })

    if (uploadError) {
      console.error('文件上传错误:', uploadError)
      return NextResponse.json({ error: '文件上传失败' }, { status: 500 })
    }

    // 获取文件URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('scl-files')
      .getPublicUrl(fileName)

    // 保存文件信息到数据库
    const { data: fileRecord, error: dbError } = await supabaseAdmin
      .from('scl_files')
      .insert({
        file_name: file.name,
        file_size: file.size,
        file_type: fileExtension as 'cid' | 'icd' | 'scd',
        file_url: publicUrl,
        user_id: userId,
        project_name: projectNameClean,
      })
      .select()
      .single()

    if (dbError) {
      console.error('数据库插入错误:', dbError)
      return NextResponse.json({ error: '文件信息保存失败' }, { status: 500 })
    }

    // 保存解析数据到数据库
    const summary = {
      substation_count: parsedData.substations.length,
      ied_count: parsedData.ieds.length,
      has_communication: parsedData.communications.length > 0,
      has_data_types: Object.keys(parsedData.dataTypes).length > 0,
    };

    const { error: parseDbError } = await supabaseAdmin
      .from('parsed_data')
      .insert({
        file_id: fileRecord.id,
        version: parsedData.version,
        parsed_content: JSON.parse(JSON.stringify(parsedData)),
        summary: summary,
        substation_count: summary.substation_count,
        ied_count: summary.ied_count,
        has_communication: summary.has_communication,
        has_data_types: summary.has_data_types,
      })

    if (parseDbError) {
      console.error('解析数据保存错误:', parseDbError)
      // 不返回错误，因为文件已经上传成功
    }

    return NextResponse.json({
      message: '文件上传和解析成功',
      file: {
        id: fileRecord.id,
        name: file.name,
        size: file.size,
        url: publicUrl,
        type: fileExtension,
        projectName,
      },
      parsedData: parsedData,
      summary: {
        substationCount: parsedData.substations.length,
        iedCount: parsedData.ieds.length,
        hasCommunication: parsedData.communications.length > 0,
        hasDataTypes: Object.keys(parsedData.dataTypes).length > 0,
      }
    })
  } catch (error) {
    console.error('文件处理错误:', error)
    return NextResponse.json({ 
      error: '文件处理失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}