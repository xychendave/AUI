import { useState, useRef, useEffect } from 'react'
import { Message } from '../types'
import MessageBubble from './MessageBubble'
import { Send, Loader2 } from 'lucide-react'

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  isConnected: boolean
}

export default function ChatInterface({ messages, onSendMessage, isConnected }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // 检查最后一条消息是否完成
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'assistant' && lastMessage.complete) {
      setIsProcessing(false)
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !isConnected || isProcessing) return

    onSendMessage(input.trim())
    setInput('')
    setIsProcessing(true)
    
    // 重置输入框高度
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    
    // 自动调整高度
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                欢迎使用 iFlow SDK
              </h2>
              <p className="text-gray-500">
                开始与 AI Agent 对话吧
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  !isConnected 
                    ? "等待连接..." 
                    : isProcessing 
                    ? "AI 正在思考..."
                    : "输入消息... (Enter 发送, Shift+Enter 换行)"
                }
                disabled={!isConnected || isProcessing}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-400"
                rows={1}
                style={{ maxHeight: '200px' }}
              />
            </div>
            
            <button
              type="submit"
              disabled={!isConnected || !input.trim() || isProcessing}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>处理中</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>发送</span>
                </>
              )}
            </button>
          </div>
          
          {!isConnected && (
            <div className="mt-2 text-sm text-amber-600 flex items-center">
              <span className="inline-block w-2 h-2 bg-amber-600 rounded-full mr-2 animate-pulse"></span>
              正在连接到服务器...
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

