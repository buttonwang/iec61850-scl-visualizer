'use client'

import { useState } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import SampleFiles from '@/components/SampleFiles'

interface FileUploadProps {
  onFileProcessed: (result: any) => void
  userId?: string
}

export default function FileUpload({ onFileProcessed, userId }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError('')
      setUploadResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (userId) {
        formData.append('userId', userId)
        formData.append('projectName', '默认项目')
      }

      const endpoint = userId && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://demo.supabase.co' 
        ? '/api/upload-with-auth' 
        : '/api/upload-demo'
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '上传失败')
      }

      setUploadResult(result)
      onFileProcessed(result)
      
      // 解析文件内容（如果没有在服务器端解析）
      if (!result.parsedData && result.fileContent) {
        await parseFileContent(result.fileContent, result.fileName)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploading(false)
    }
  }

  const parseFileContent = async (content: string, fileName: string) => {
    try {
      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileContent: content,
          fileName: fileName,
        }),
      })

      const parseResult = await response.json()

      if (!response.ok) {
        throw new Error(parseResult.error || '解析失败')
      }

      setUploadResult((prev: any) => ({
        ...prev,
        parsedData: parseResult.data,
        summary: parseResult.summary,
      }))
    } catch (err) {
      setError(`文件解析失败: ${err instanceof Error ? err.message : '未知错误'}`)
    }
  }

  const isValidFileType = (fileName: string) => {
    return fileName.endsWith('.cid') || fileName.endsWith('.icd') || fileName.endsWith('.scd')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">上传SCL文件</h2>
        <p className="text-gray-600">支持IEC 61850标准的.cid、.icd、.scd文件格式</p>
      </div>

      <div className="mb-6">
        <label className="block">
          <input
            type="file"
            accept=".cid,.icd,.scd"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
      </div>

      {file && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-medium">{file.name}</span>
            <span className="text-sm text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
          </div>
          
          {isValidFileType(file.name) ? (
            <div className="flex items-center space-x-2 mt-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">文件格式有效</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 mt-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">不支持的文件格式</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading || !isValidFileType(file.name)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {uploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>处理中...</span>
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            <span>上传并解析文件</span>
          </>
        )}
      </button>

      {uploadResult && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700 mb-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">文件处理成功</span>
          </div>
          
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>文件名:</strong> {uploadResult.fileName}</p>
            <p><strong>文件大小:</strong> {uploadResult.fileSize} 字节</p>
            
            {uploadResult.summary && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <h4 className="font-medium mb-2">解析摘要:</h4>
                <ul className="space-y-1">
                  <li>• 变电站数量: {uploadResult.summary.substationCount}</li>
                  <li>• IED设备数量: {uploadResult.summary.iedCount}</li>
                  <li>• 通信配置: {uploadResult.summary.hasCommunication ? '已配置' : '未配置'}</li>
                  <li>• 数据类型: {uploadResult.summary.hasDataTypes ? '已定义' : '未定义'}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <SampleFiles onFileSelect={(content, fileName) => {
          // 创建虚拟文件对象
          const virtualFile = new File([content], fileName, { type: 'application/xml' })
          setFile(virtualFile)
          setError('')
          setUploadResult(null)
        }} />
      </div>
    </div>
  )
}