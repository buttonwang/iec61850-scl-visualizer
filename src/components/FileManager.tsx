'use client'

import { useState, useEffect } from 'react'
import { SCLFile } from '@/lib/supabase-client'
import { FileText, Download, Trash2, Calendar, User, Folder } from 'lucide-react'

interface FileManagerProps {
  userId: string
  onFileSelect: (file: SCLFile) => void
}

export default function FileManager({ userId, onFileSelect }: FileManagerProps) {
  const [files, setFiles] = useState<SCLFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (userId) {
      loadFiles()
    }
  }, [userId])

  const loadFiles = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(`/api/files?userId=${userId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '加载文件列表失败')
      }

      setFiles(data.files || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : '加载文件列表失败')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteFile = async (fileId: string) => {
    if (!confirm('确定要删除这个文件吗？此操作不可恢复。')) {
      return
    }

    try {
      const response = await fetch(`/api/files?fileId=${fileId}&userId=${userId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '删除文件失败')
      }

      // 从列表中移除已删除的文件
      setFiles(prev => prev.filter(file => file.id !== fileId))
    } catch (error) {
      alert(error instanceof Error ? error.message : '删除文件失败')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">文件管理</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">文件管理</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadFiles}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">文件管理</h2>
        <button
          onClick={loadFiles}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          刷新
        </button>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">暂无文件</p>
          <p className="text-sm text-gray-500">上传您的第一个SCL文件开始使用</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onFileSelect(file)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">{file.file_name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {file.file_type.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Folder className="h-4 w-4" />
                      <span>{file.project_name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{file.user_id.slice(0, 8)}...</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                    
                    <div>
                      <span>{formatFileSize(file.file_size)}</span>
                    </div>
                  </div>
                  
                  {/* TODO: 从parsed_data表中加载解析信息 */}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <a
                    href={file.file_url}
                    download={file.file_name}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="下载文件"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="删除文件"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}