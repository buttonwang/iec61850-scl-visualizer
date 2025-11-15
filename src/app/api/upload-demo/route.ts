import { NextRequest, NextResponse } from 'next/server'
import { SCLParser, ParsedSCL } from '@/lib/scl-parser'

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
    
    // 解析SCL文件
    const parser = new SCLParser()
    
    // 验证文件
    const validation = parser.validateSCLFile(fileContent)
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'SCL文件验证失败', 
        details: validation.errors 
      }, { status: 400 })
    }

    // 解析文件
    const parsedData: ParsedSCL = await parser.parseSCLFile(fileContent, file.name)

    return NextResponse.json({
      message: '文件解析成功',
      fileName: file.name,
      fileSize: file.size,
      fileContent: fileContent.substring(0, 1000), // 返回前1000个字符用于预览
      parsedData,
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