import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { messageType, targetDevice, parameters, userId, fileId } = await request.json()

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

    // 如果提供了文件ID，保存模拟日志到数据库
    if (fileId) {
      try {
        await supabaseAdmin.from('simulation_logs').insert({
          file_id: fileId,
          message_type: messageType,
          target_device: targetDevice,
          parameters: parameters || {},
          response_time: simulationResult.responseTime,
          status: simulationResult.status === 'success' ? 'success' : 'error',
          result_data: simulationResult,
        })
      } catch (logError) {
        console.error('保存模拟日志失败:', logError)
        // 不返回错误，因为模拟本身是成功的
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