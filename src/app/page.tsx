'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import SCLStructureViewer from '@/components/SCLStructureViewer'
import SubstationVisualization from '@/components/SubstationVisualization'
import MessageSimulator from '@/components/MessageSimulator'
import AuthManager from '@/components/AuthManager'
import FileManager from '@/components/FileManager'
import { ParsedSCL } from '@/lib/scl-parser'
import { SCLFile } from '@/lib/supabase-client'
import { isDemoMode, getDemoUser } from '@/lib/demo-mode'
import { Network, Zap, Activity, Eye, FileText, Folder } from 'lucide-react'
import { useEffect } from 'react'

type ViewMode = 'upload' | 'structure' | 'visualization' | 'simulation' | 'files'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [parsedData, setParsedData] = useState<ParsedSCL | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('upload')
  const [currentFile, setCurrentFile] = useState<SCLFile | null>(null)
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)

  useEffect(() => {
    // 检查是否配置了Supabase
    const checkSupabase = () => {
      const demoMode = isDemoMode()
      setIsSupabaseConfigured(!demoMode)
      
      // 如果是演示模式，自动设置一个演示用户
      if (demoMode && !user) {
        setUser(getDemoUser())
      }
    }
    checkSupabase()
  }, [user])

  const handleFileProcessed = (result: any) => {
    if (result.parsedData) {
      setParsedData(result.parsedData)
      setViewMode('structure')
      if (result.file) {
        setCurrentFile(result.file)
      }
    }
  }

  const handleFileSelect = (file: SCLFile) => {
    setCurrentFile(file)
    // 这里可以加载文件的解析数据
    // TODO: 从parsed_data表中加载完整数据
    setParsedData({
      fileName: file.file_name,
      version: '1.0', // 默认值
      header: {},
      substations: [],
      ieds: [],
      communications: [],
      dataTypes: {},
      structure: {},
    } as ParsedSCL)
    setViewMode('structure')
  }

  const getDevices = () => {
    if (!parsedData) return []
    
    const devices = [
      ...parsedData.ieds.map((ied, index) => ({
        id: `ied-${index}`,
        name: ied.name,
        type: 'IED'
      })),
      ...parsedData.substations.flatMap((sub, subIndex) => 
        sub.voltageLevel?.flatMap((vl: any, vlIndex: number) =>
          vl.bays?.map((bay: any, bayIndex: number) => ({
            id: `bay-${subIndex}-${vlIndex}-${bayIndex}`,
            name: bay.name,
            type: '间隔'
          }))
        ) || []
      )
    ]
    
    return devices
  }

  const renderNavigation = () => (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Network className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">
              IEC 61850 SCL解析系统
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <AuthManager />
          </div>
        </div>
      </div>
    </nav>
  )

  const renderMainNavigation = () => (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-1 py-4">
          {[
            { key: 'upload', label: '文件上传', icon: FileText },
            { key: 'files', label: '文件管理', icon: Folder },
            { key: 'structure', label: '结构分析', icon: Eye },
            { key: 'visualization', label: '设备可视化', icon: Network },
            { key: 'simulation', label: '消息模拟', icon: Zap },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setViewMode(key as ViewMode)}
              disabled={false} // Remove authentication requirement for demo mode
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (viewMode) {
      case 'upload':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                IEC 61850 SCL文件解析与可视化系统
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                智能变电站配置描述语言文件的专业解析工具，支持设备可视化、结构分析和消息模拟
              </p>
              {!isSupabaseConfigured && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800">
                    🎯 当前为演示模式 - 所有核心功能已启用，无需登录即可体验！
                  </p>
                </div>
              )}
              {!user && isSupabaseConfigured && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    请先登录以使用完整功能，包括文件管理和数据存储。
                  </p>
                </div>
              )}
            </div>
            <FileUpload onFileProcessed={handleFileProcessed} userId={isSupabaseConfigured ? user?.id : undefined} />
          </div>
        )
      
      case 'files':
        return isSupabaseConfigured ? (
          user ? (
            <div className="max-w-6xl mx-auto">
              <FileManager userId={user.id} onFileSelect={handleFileSelect} />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h2>
                <p className="text-gray-600 mb-6">登录后可管理您的SCL文件</p>
                <AuthManager />
              </div>
            </div>
          )
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">演示模式</h2>
              <p className="text-gray-600 mb-6">当前为演示模式，文件管理功能需要配置Supabase</p>
              <div className="text-sm text-gray-500">
                <p>演示模式下，您可以：</p>
                <ul className="text-left mt-2 space-y-1">
                  <li>• 上传和解析SCL文件</li>
                  <li>• 查看文件结构分析</li>
                  <li>• 使用设备可视化</li>
                  <li>• 进行消息模拟</li>
                </ul>
              </div>
            </div>
          </div>
        )
      
      case 'structure':
        return parsedData ? (
          <SCLStructureViewer data={parsedData} />
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">请先上传文件</h2>
              <p className="text-gray-600 mb-6">上传SCL文件后查看结构分析</p>
              <button
                onClick={() => setViewMode('upload')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                上传文件
              </button>
            </div>
          </div>
        )
      
      case 'visualization':
        return parsedData ? (
          <SubstationVisualization data={parsedData} />
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">请先上传文件</h2>
              <p className="text-gray-600 mb-6">上传SCL文件后查看设备可视化</p>
              <button
                onClick={() => setViewMode('upload')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                上传文件
              </button>
            </div>
          </div>
        )
      
      case 'simulation':
        return parsedData ? (
          <MessageSimulator 
            devices={getDevices()} 
            userId={user?.id || 'demo-user'}
            fileId={currentFile?.id || 'demo-file'}
          />
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">请先上传文件</h2>
              <p className="text-gray-600 mb-6">上传SCL文件后进行消息模拟</p>
              <button
                onClick={() => setViewMode('upload')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                上传文件
              </button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      {renderMainNavigation()}
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* 功能介绍 */}
      {viewMode === 'upload' && (
        <section className="mt-16 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">系统功能特点</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: FileText,
                  title: 'SCL文件解析',
                  description: '支持IEC 61850标准的.cid、.icd、.scd文件格式解析，提取设备配置信息',
                  color: 'blue'
                },
                {
                  icon: Eye,
                  title: '结构分析',
                  description: '详细的SCL文件结构展示，包括变电站、IED设备、通信配置等层次结构',
                  color: 'green'
                },
                {
                  icon: Network,
                  title: '设备可视化',
                  description: '直观的变电站设备拓扑图展示，清晰显示设备间连接关系和运行状态',
                  color: 'purple'
                },
                {
                  icon: Zap,
                  title: '消息模拟',
                  description: '模拟IEC 61850消息传输，支持多种消息类型的发送和响应分析',
                  color: 'orange'
                },
              ].map((feature, index) => {
                const Icon = feature.icon
                const bgColor = `bg-${feature.color}-100`
                const textColor = `text-${feature.color}-600`
                const borderColor = `border-${feature.color}-200`
                
                return (
                  <div key={index} className={`p-6 rounded-lg border ${borderColor}`}>
                    <div className={`${bgColor} rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                      <Icon className={`h-8 w-8 ${textColor}`} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">{feature.title}</h3>
                    <p className="text-gray-600 text-sm text-center">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}