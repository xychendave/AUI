import { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import Sidebar from './components/Sidebar'
import ConfigPanel from './components/ConfigPanel'
import { useWebSocket } from './hooks/useWebSocket'
import { Message, ToolCall, Plan } from './types'
import { Settings } from 'lucide-react'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [showConfig, setShowConfig] = useState(false)
  const [config, setConfig] = useState({
    permission_mode: 'auto',
    auto_start_process: true,
    session_id: null as string | null,
  })

  const { 
    isConnected, 
    sendMessage, 
    connectionStatus 
  } = useWebSocket({
    onMessage: (data) => {
      switch (data.type) {
        case 'assistant_chunk':
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1]
            if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.complete) {
              return [
                ...prev.slice(0, -1),
                { ...lastMsg, content: lastMsg.content + data.content }
              ]
            }
            return [...prev, {
              id: Date.now().toString(),
              role: 'assistant',
              content: data.content,
              timestamp: new Date(data.timestamp),
              complete: false
            }]
          })
          break

        case 'task_finish':
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1]
            if (lastMsg && lastMsg.role === 'assistant') {
              return [
                ...prev.slice(0, -1),
                { ...lastMsg, complete: true }
              ]
            }
            return prev
          })
          break

        case 'tool_call':
          setToolCalls(prev => [...prev, {
            id: data.tool_id,
            label: data.label,
            description: data.description,
            status: data.status,
            timestamp: new Date(data.timestamp)
          }])
          break

        case 'plan':
          setPlans(prev => [...prev, {
            id: Date.now().toString(),
            title: data.title,
            tasks: data.tasks,
            timestamp: new Date(data.timestamp)
          }])
          break

        case 'error':
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'system',
            content: `❌ 错误: ${data.message}`,
            timestamp: new Date(data.timestamp),
            complete: true
          }])
          break
      }
    },
    config
  })

  const handleSendMessage = (content: string) => {
    // 添加用户消息到界面
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      complete: true
    }])

    // 发送到后端
    sendMessage({
      type: 'chat',
      message: content,
      config
    })
  }

  const handleClearChat = () => {
    setMessages([])
    setToolCalls([])
    setPlans([])
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 */}
      <Sidebar
        isConnected={isConnected}
        connectionStatus={connectionStatus}
        toolCalls={toolCalls}
        plans={plans}
        onClearChat={handleClearChat}
      />

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部栏 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">iFlow SDK</h1>
            <p className="text-sm text-gray-500">AI Agent 交互界面</p>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="设置"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </header>

        {/* 聊天界面 */}
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isConnected={isConnected}
        />
      </div>

      {/* 配置面板 */}
      {showConfig && (
        <ConfigPanel
          config={config}
          onConfigChange={setConfig}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  )
}

export default App

