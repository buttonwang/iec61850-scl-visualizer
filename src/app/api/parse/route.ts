import { SCLParser, ParsedSCL } from '@/lib/scl-parser'

export async function POST(request: Request) {
  try {
    const { fileContent, fileName } = await request.json()

    if (!fileContent || !fileName) {
      return Response.json({ error: '缺少必要的参数' }, { status: 400 })
    }

    const parser = new SCLParser()
    
    // 验证文件
    const validation = parser.validateSCLFile(fileContent)
    if (!validation.isValid) {
      return Response.json({ 
        error: 'SCL文件验证失败', 
        details: validation.errors 
      }, { status: 400 })
    }

    // 解析文件
    const parsedData: ParsedSCL = await parser.parseSCLFile(fileContent, fileName)

    return Response.json({
      message: 'SCL文件解析成功',
      data: parsedData,
      summary: {
        substationCount: parsedData.substations.length,
        iedCount: parsedData.ieds.length,
        hasCommunication: parsedData.communications.length > 0,
        hasDataTypes: Object.keys(parsedData.dataTypes).length > 0,
      }
    })
  } catch (error) {
    console.error('SCL解析错误:', error)
    return Response.json({ 
      error: 'SCL文件解析失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}