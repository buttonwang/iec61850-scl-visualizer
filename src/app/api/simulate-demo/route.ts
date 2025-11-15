import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messageType, targetDevice, parameters } = await request.json()

    if (!messageType || !targetDevice) {
      return NextResponse.json({ error: '缺少必要的参数' }, { status: 400 })
    }

    // 模拟IEC 61850消息处理
    const simulationResult = {
      messageId: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      messageType,
      targetDevice,
      parameters,
      status: 'success',
      responseTime: Math.floor(Math.random() * 100) + 50, // 50-150ms
      result: {
        deviceStatus: Math.random() > 0.8 ? 'error' : 'normal',
        value: Math.floor(Math.random() * 1000),
        quality: Math.random() > 0.9 ? 'invalid' : 'good',
      }
    }

    return NextResponse.json({
      message: '消息模拟成功',
      simulation: simulationResult,
    })
  } catch (error) {
    console.error('消息模拟错误:', error)
    return NextResponse.json({ 
      error: '消息模拟失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}