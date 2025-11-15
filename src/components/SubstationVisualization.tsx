'use client'

import { useState, useEffect } from 'react'
import { ParsedSCL } from '@/lib/scl-parser'
import { Network, Cpu, Zap, Activity } from 'lucide-react'

interface SubstationVisualizationProps {
  data: ParsedSCL
}

interface DeviceNode {
  id: string
  name: string
  type: 'substation' | 'voltageLevel' | 'bay' | 'ied' | 'equipment'
  x: number
  y: number
  parent?: string
  children?: string[]
  status?: 'normal' | 'warning' | 'error' | 'offline'
  data?: any
}

interface Connection {
  from: string
  to: string
  type: 'power' | 'communication' | 'control'
  status?: 'active' | 'inactive'
}

export default function SubstationVisualization({ data }: SubstationVisualizationProps) {
  const [nodes, setNodes] = useState<DeviceNode[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [simulationActive, setSimulationActive] = useState(false)

  useEffect(() => {
    generateVisualizationData()
  }, [data])

  const generateVisualizationData = () => {
    const newNodes: DeviceNode[] = []
    const newConnections: Connection[] = []
    let yOffset = 50

    // 生成变电站节点
    data.substations.forEach((substation, subIndex) => {
      const subNode: DeviceNode = {
        id: `sub-${subIndex}`,
        name: substation.name,
        type: 'substation',
        x: 400,
        y: yOffset,
        status: 'normal',
        data: substation,
      }
      newNodes.push(subNode)

      // 生成电压等级节点
      let voltageYOffset = yOffset + 100
      substation.voltageLevel?.forEach((voltageLevel: any, vlIndex: number) => {
        const vlNode: DeviceNode = {
          id: `vl-${subIndex}-${vlIndex}`,
          name: voltageLevel.name,
          type: 'voltageLevel',
          x: 200 + vlIndex * 200,
          y: voltageYOffset,
          parent: `sub-${subIndex}`,
          status: 'normal',
          data: voltageLevel,
        }
        newNodes.push(vlNode)

        // 连接变电站到电压等级
        newConnections.push({
          from: `sub-${subIndex}`,
          to: `vl-${subIndex}-${vlIndex}`,
          type: 'power',
          status: 'active',
        })

        // 生成间隔节点
        let bayXOffset = 100
        voltageLevel.bays?.forEach((bay: any, bayIndex: number) => {
          const bayNode: DeviceNode = {
            id: `bay-${subIndex}-${vlIndex}-${bayIndex}`,
            name: bay.name,
            type: 'bay',
            x: bayXOffset,
            y: voltageYOffset + 100,
            parent: `vl-${subIndex}-${vlIndex}`,
            status: 'normal',
            data: bay,
          }
          newNodes.push(bayNode)
          bayXOffset += 150

          // 连接电压等级到间隔
          newConnections.push({
            from: `vl-${subIndex}-${vlIndex}`,
            to: `bay-${subIndex}-${vlIndex}-${bayIndex}`,
            type: 'power',
            status: 'active',
          })

          // 生成设备节点
          bay.devices?.forEach((device: any, deviceIndex: number) => {
            const deviceNode: DeviceNode = {
              id: `device-${subIndex}-${vlIndex}-${bayIndex}-${deviceIndex}`,
              name: device.name,
              type: 'equipment',
              x: bayXOffset - 150 + deviceIndex * 50,
              y: voltageYOffset + 180,
              parent: `bay-${subIndex}-${vlIndex}-${bayIndex}`,
              status: 'normal',
              data: device,
            }
            newNodes.push(deviceNode)

            // 连接间隔到设备
            newConnections.push({
              from: `bay-${subIndex}-${vlIndex}-${bayIndex}`,
              to: `device-${subIndex}-${vlIndex}-${bayIndex}-${deviceIndex}`,
              type: 'power',
              status: 'active',
            })
          })
        })

        voltageYOffset += 200
      })

      yOffset = voltageYOffset + 100
    })

    // 生成IED节点
    let iedXOffset = 50
    data.ieds.forEach((ied, iedIndex) => {
      const iedNode: DeviceNode = {
        id: `ied-${iedIndex}`,
        name: ied.name,
        type: 'ied',
        x: iedXOffset,
        y: 300,
        status: 'normal',
        data: ied,
      }
      newNodes.push(iedNode)
      iedXOffset += 120

      // 连接IED到相关设备（简化处理）
      if (ied.accessPoints?.[0]?.server?.ld) {
        newConnections.push({
          from: `ied-${iedIndex}`,
          to: `sub-0`, // 简化连接
          type: 'communication',
          status: 'active',
        })
      }
    })

    setNodes(newNodes)
    setConnections(newConnections)
  }

  const getNodeColor = (node: DeviceNode) => {
    const colors = {
      normal: {
        substation: 'fill-blue-500 stroke-blue-700',
        voltageLevel: 'fill-green-500 stroke-green-700',
        bay: 'fill-yellow-500 stroke-yellow-700',
        ied: 'fill-purple-500 stroke-purple-700',
        equipment: 'fill-gray-500 stroke-gray-700',
      },
      warning: {
        substation: 'fill-yellow-500 stroke-yellow-700',
        voltageLevel: 'fill-yellow-500 stroke-yellow-700',
        bay: 'fill-yellow-500 stroke-yellow-700',
        ied: 'fill-yellow-500 stroke-yellow-700',
        equipment: 'fill-yellow-500 stroke-yellow-700',
      },
      error: {
        substation: 'fill-red-500 stroke-red-700',
        voltageLevel: 'fill-red-500 stroke-red-700',
        bay: 'fill-red-500 stroke-red-700',
        ied: 'fill-red-500 stroke-red-700',
        equipment: 'fill-red-500 stroke-red-700',
      },
      offline: {
        substation: 'fill-gray-300 stroke-gray-500',
        voltageLevel: 'fill-gray-300 stroke-gray-500',
        bay: 'fill-gray-300 stroke-gray-500',
        ied: 'fill-gray-300 stroke-gray-500',
        equipment: 'fill-gray-300 stroke-gray-500',
      },
    }

    return colors[node.status || 'normal'][node.type]
  }

  const getConnectionColor = (connection: Connection) => {
    const colors = {
      power: connection.status === 'active' ? 'stroke-orange-500' : 'stroke-orange-300',
      communication: connection.status === 'active' ? 'stroke-blue-500' : 'stroke-blue-300',
      control: connection.status === 'active' ? 'stroke-green-500' : 'stroke-green-300',
    }
    return colors[connection.type]
  }

  const startSimulation = () => {
    setSimulationActive(true)
    
    // 模拟设备状态变化
    const interval = setInterval(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          status: Math.random() > 0.8 ? 
            (['normal', 'warning', 'error'] as const)[Math.floor(Math.random() * 3)] : 
            node.status
        }))
      )

      setConnections(prevConnections =>
        prevConnections.map(conn => ({
          ...conn,
          status: Math.random() > 0.7 ? 
            (['active', 'inactive'] as const)[Math.floor(Math.random() * 2)] : 
            conn.status
        }))
      )
    }, 2000)

    // 10秒后停止模拟
    setTimeout(() => {
      clearInterval(interval)
      setSimulationActive(false)
      
      // 重置状态
      setNodes(prevNodes => 
        prevNodes.map(node => ({ ...node, status: 'normal' }))
      )
      setConnections(prevConnections =>
        prevConnections.map(conn => ({ ...conn, status: 'active' }))
      )
    }, 10000)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">变电站设备拓扑图</h2>
        <button
          onClick={startSimulation}
          disabled={simulationActive}
          className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
            simulationActive
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>{simulationActive ? '模拟运行中...' : '开始模拟'}</span>
        </button>
      </div>

      <div className="relative bg-gray-50 rounded-lg" style={{ height: '600px' }}>
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* 渲染连接线 */}
          {connections.map((connection, index) => {
            const fromNode = nodes.find(n => n.id === connection.from)
            const toNode = nodes.find(n => n.id === connection.to)
            
            if (!fromNode || !toNode) return null
            
            return (
              <line
                key={index}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className={`${getConnectionColor(connection)} stroke-2`}
                strokeDasharray={connection.status === 'inactive' ? '5,5' : '0'}
              />
            )
          })}
          
          {/* 渲染节点 */}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                className={`${getNodeColor(node)} stroke-2 cursor-pointer`}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              />
              
              {/* 状态指示器 */}
              {node.status !== 'normal' && (
                <circle
                  cx={node.x + 15}
                  cy={node.y - 15}
                  r="6"
                  className={
                    node.status === 'warning' ? 'fill-yellow-400' :
                    node.status === 'error' ? 'fill-red-500' : 'fill-gray-400'
                  }
                />
              )}
              
              {/* 节点标签 */}
              <text
                x={node.x}
                y={node.y + 35}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {node.name}
              </text>
              
              {/* 节点类型图标 */}
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="text-xs font-bold fill-white"
              >
                {node.type === 'substation' && 'S'}
                {node.type === 'voltageLevel' && 'V'}
                {node.type === 'bay' && 'B'}
                {node.type === 'ied' && 'I'}
                {node.type === 'equipment' && 'E'}
              </text>
            </g>
          ))}
        </svg>

        {/* 选中节点的详细信息 */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">节点详情</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            {(() => {
              const node = nodes.find(n => n.id === selectedNode)
              if (!node) return null
              
              return (
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>名称:</strong> {node.name}
                  </div>
                  <div>
                    <strong>类型:</strong> {node.type}
                  </div>
                  <div>
                    <strong>状态:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                      node.status === 'normal' ? 'bg-green-100 text-green-800' :
                      node.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      node.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                  
                  {node.data && (
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="font-medium mb-1">配置信息</h4>
                      <div className="text-xs text-gray-600">
                        {node.type === 'ied' && (
                          <div>
                            <div>制造商: {node.data.manufacturer}</div>
                            <div>类型: {node.data.type}</div>
                          </div>
                        )}
                        {node.type === 'voltageLevel' && (
                          <div>
                            <div>电压: {node.data.voltage}</div>
                            <div>间隔数: {node.data.bays?.length || 0}</div>
                          </div>
                        )}
                        {node.type === 'equipment' && (
                          <div>
                            <div>设备类型: {node.data.type}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* 图例 */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>变电站</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>电压等级</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span>间隔</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          <span>IED设备</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
          <span>设备</span>
        </div>
      </div>
    </div>
  )
}