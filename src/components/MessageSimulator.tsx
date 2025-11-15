'use client'

import { useState } from 'react'
import { Send, Play, Square, Activity, Zap, Radio } from 'lucide-react'

interface MessageSimulatorProps {
  devices: Array<{
    id: string
    name: string
    type: string
  }>
  userId?: string
  fileId?: string
}

interface MessageResult {
  messageId: string
  timestamp: string
  messageType: string
  targetDevice: string
  status: string
  responseTime: number
  result: {
    deviceStatus: string
    value: number
    quality: string
  }
}

export default function MessageSimulator({ devices, userId, fileId }: MessageSimulatorProps) {
  const [selectedDevice, setSelectedDevice] = useState('')
  const [messageType, setMessageType] = useState('READ')
  const [parameters, setParameters] = useState('{}')
  const [isSimulating, setIsSimulating] = useState(false)
  const [results, setResults] = useState<MessageResult[]>([])
  const [autoMode, setAutoMode] = useState(false)

  const messageTypes = [
    { value: 'READ', label: '读取数据 (READ)' },
    { value: 'WRITE', label: '写入数据 (WRITE)' },
    { value: 'CONTROL', label: '控制命令 (CONTROL)' },
    { value: 'REPORT', label: '报告消息 (REPORT)' },
    { value: 'GOOSE', label: 'GOOSE消息' },
    { value: 'SV', label: '采样值 (SV)' },
  ]

  const simulateMessage = async () => {
    if (!selectedDevice) return

    setIsSimulating(true)
    
    try {
      const endpoint = process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://demo.supabase.co' 
        ? '/api/simulate' 
        : '/api/simulate-demo'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageType,
          targetDevice: selectedDevice,
          parameters: JSON.parse(parameters || '{}'),
          userId: userId,
          fileId: fileId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '模拟失败')
      }

      setResults(prev => [result.simulation, ...prev.slice(0, 9)]) // 保留最近10条结果
    } catch (error) {
      console.error('消息模拟失败:', error)
    } finally {
      setIsSimulating(false)
    }
  }

  const startAutoSimulation = () => {
    setAutoMode(true)
    const interval = setInterval(() => {
      if (devices.length > 0) {
        const randomDevice = devices[Math.floor(Math.random() * devices.length)]
        const randomMessageType = messageTypes[Math.floor(Math.random() * messageTypes.length)].value
        
        simulateMessageAuto(randomDevice.id, randomMessageType)
      }
    }, 3000)

    // 30秒后停止自动模拟
    setTimeout(() => {
      clearInterval(interval)
      setAutoMode(false)
    }, 30000)
  }

  const simulateMessageAuto = async (deviceId: string, msgType: string) => {
    try {
      const endpoint = process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://demo.supabase.co' 
        ? '/api/simulate' 
        : '/api/simulate-demo'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageType: msgType,
          targetDevice: deviceId,
          parameters: {},
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setResults(prev => [result.simulation, ...prev.slice(0, 9)])
      }
    } catch (error) {
      console.error('自动模拟失败:', error)
    }
  }

  const stopAutoSimulation = () => {
    setAutoMode(false)
    window.location.reload() // 简单重置
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <Radio className="h-6 w-6" />
          <span>IEC 61850 消息模拟器</span>
        </h2>
        
        <div className="flex items-center space-x-2">
          {autoMode ? (
            <button
              onClick={stopAutoSimulation}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
            >
              <Square className="h-4 w-4" />
              <span>停止自动</span>
            </button>
          ) : (
            <button
              onClick={startAutoSimulation}
              disabled={devices.length === 0}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>自动模拟</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 控制面板 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标设备
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">选择设备</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name} ({device.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              消息类型
            </label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {messageTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              参数 (JSON格式)
            </label>
            <textarea
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder='{"value": 100, "quality": "good"}'
            />
          </div>

          <button
            onClick={simulateMessage}
            disabled={!selectedDevice || isSimulating}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSimulating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>模拟中...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>发送消息</span>
              </>
            )}
          </button>
        </div>

        {/* 结果展示 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">模拟结果</h3>
            {results.length > 0 && (
              <button
                onClick={clearResults}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                清空结果
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>暂无模拟结果</p>
                <p className="text-sm">发送消息或启动自动模拟开始</p>
              </div>
            ) : (
              results.map((result, index) => (
                <div
                  key={result.messageId}
                  className={`p-3 rounded-lg border ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Zap className={`h-4 w-4 ${
                        result.status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`} />
                      <span className="font-medium text-sm">{result.messageType}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.status === 'success'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-gray-600">
                    <div><strong>设备:</strong> {result.targetDevice}</div>
                    <div><strong>响应时间:</strong> {result.responseTime}ms</div>
                    <div><strong>设备状态:</strong> 
                      <span className={`ml-1 px-1 rounded ${
                        result.result.deviceStatus === 'normal'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.result.deviceStatus}
                      </span>
                    </div>
                    <div><strong>数值:</strong> {result.result.value}</div>
                    <div><strong>质量:</strong> 
                      <span className={`ml-1 px-1 rounded ${
                        result.result.quality === 'good'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {result.result.quality}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 状态指示器 */}
      {autoMode && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-blue-700 font-medium">自动模拟模式运行中...</span>
          </div>
        </div>
      )}
    </div>
  )
}