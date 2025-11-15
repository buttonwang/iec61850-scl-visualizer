'use client'

import { useState } from 'react'
import { sampleFiles, downloadSampleFile } from '@/lib/sample-files'
import { Download, FileText, Info } from 'lucide-react'

interface SampleFilesProps {
  onFileSelect: (content: string, fileName: string) => void
}

export default function SampleFiles({ onFileSelect }: SampleFilesProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const handleDownload = (file: typeof sampleFiles[0]) => {
    downloadSampleFile(file)
  }

  const handlePreview = (file: typeof sampleFiles[0]) => {
    setSelectedFile(file.content)
    onFileSelect(file.content, file.name)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">示例文件</h2>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Info className="h-4 w-4" />
          <span>点击预览或下载示例文件进行测试</span>
        </div>
      </div>

      <div className="space-y-4">
        {sampleFiles.map((file, index) => (
          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">{file.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {file.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{file.description}</p>
                
                {selectedFile === file.content && (
                  <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                    <div className="text-xs text-gray-600 mb-2 font-medium">文件预览:</div>
                    <pre className="text-xs text-gray-700 overflow-auto max-h-32 bg-white p-2 rounded border">
                      {file.content.substring(0, 500)}...
                    </pre>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handlePreview(file)}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span>预览</span>
                </button>
                
                <button
                  onClick={() => handleDownload(file)}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>下载</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-800">
          <Info className="h-4 w-4" />
          <span className="text-sm font-medium">使用提示</span>
        </div>
        <p className="text-sm text-blue-700 mt-2">
          这些示例文件包含了典型的IEC 61850 SCL文件结构。您可以下载后在系统中上传测试，
          或者直接点击预览按钮加载文件内容进行解析。
        </p>
      </div>
    </div>
  )
}