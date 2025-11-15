'use client'

import { useState } from 'react'
import { ParsedSCL } from '@/lib/scl-parser'
import { Network, Cpu, RadioTower, Database } from 'lucide-react'

interface SCLStructureViewerProps {
  data: ParsedSCL
}

export default function SCLStructureViewer({ data }: SCLStructureViewerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'substation' | 'ied' | 'communication'>('overview')

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Network className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-blue-900">变电站</h3>
        </div>
        <p className="text-2xl font-bold text-blue-700">{data.substations.length}</p>
        <p className="text-sm text-blue-600">个变电站</p>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Cpu className="h-5 w-5 text-green-600" />
          <h3 className="font-medium text-green-900">IED设备</h3>
        </div>
        <p className="text-2xl font-bold text-green-700">{data.ieds.length}</p>
        <p className="text-sm text-green-600">个智能电子设备</p>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <RadioTower className="h-5 w-5 text-purple-600" />
          <h3 className="font-medium text-purple-900">通信配置</h3>
        </div>
        <p className="text-2xl font-bold text-purple-700">{data.communications.length}</p>
        <p className="text-sm text-purple-600">个通信配置</p>
      </div>
      
      <div className="bg-orange-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Database className="h-5 w-5 text-orange-600" />
          <h3 className="font-medium text-orange-900">数据类型</h3>
        </div>
        <p className="text-2xl font-bold text-orange-700">
          {Object.keys(data.dataTypes).length}
        </p>
        <p className="text-sm text-orange-600">种数据类型</p>
      </div>
    </div>
  )

  const renderSubstations = () => (
    <div className="space-y-4">
      {data.substations.map((substation, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Network className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-lg">{substation.name}</h3>
            {substation.desc && (
              <span className="text-sm text-gray-500">({substation.desc})</span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 text-gray-700">电压等级</h4>
              <div className="space-y-2">
                {substation.voltageLevel?.map((vl: any, vlIndex: number) => (
                  <div key={vlIndex} className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{vl.name}</div>
                    <div className="text-sm text-gray-600">
                      电压: {vl.voltage} | 间隔数: {vl.bays?.length || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-gray-700">间隔</h4>
              <div className="space-y-2">
                {substation.bays?.map((bay: any, bayIndex: number) => (
                  <div key={bayIndex} className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{bay.name}</div>
                    <div className="text-sm text-gray-600">
                      设备数: {bay.devices?.length || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderIEDs = () => (
    <div className="space-y-4">
      {data.ieds.map((ied, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Cpu className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-lg">{ied.name}</h3>
            <span className="text-sm text-gray-500">
              {ied.manufacturer} - {ied.type}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 text-gray-700">基本信息</h4>
              <ul className="text-sm space-y-1">
                <li><strong>制造商:</strong> {ied.manufacturer}</li>
                <li><strong>类型:</strong> {ied.type}</li>
                <li><strong>配置版本:</strong> {ied.configVersion}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-gray-700">访问点</h4>
              <div className="space-y-1">
                {ied.accessPoints?.map((ap: any, apIndex: number) => (
                  <div key={apIndex} className="text-sm">
                    <span className="font-medium">{ap.name}</span>
                    {ap.desc && <span className="text-gray-600"> - {ap.desc}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderCommunications = () => (
    <div className="space-y-4">
      {data.communications.map((comm, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <RadioTower className="h-5 w-5 text-purple-600" />
            <h3 className="font-medium text-lg">通信配置 {index + 1}</h3>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(comm, null, 2)}
            </pre>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b">
        <nav className="flex space-x-8 px-6">
          {[
            { key: 'overview', label: '概览', icon: Network },
            { key: 'substation', label: '变电站', icon: Network },
            { key: 'ied', label: 'IED设备', icon: Cpu },
            { key: 'communication', label: '通信', icon: RadioTower },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'substation' && renderSubstations()}
        {activeTab === 'ied' && renderIEDs()}
        {activeTab === 'communication' && renderCommunications()}
      </div>
    </div>
  )
}