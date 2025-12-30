import { Message } from '../types'
import { User, Bot, AlertCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { formatDistanceToNow } from 'date-fns'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="max-w-2xl px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{message.content}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
        {/* 头像 */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isUser ? 'bg-primary-500' : 'bg-gray-700'
          }`}>
            {isUser ? (
              <User className="w-6 h-6 text-white" />
            ) : (
              <Bot className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        {/* 消息内容 */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-lg ${
            isUser 
              ? 'bg-primary-600 text-white' 
              : 'bg-white border border-gray-200'
          }`}>
            {isUser ? (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    code: ({ children, className }) => {
                      const isInline = !className
                      return isInline ? (
                        <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <code className="block px-4 py-3 bg-gray-50 rounded-lg overflow-x-auto text-sm font-mono">
                          {children}
                        </code>
                      )
                    },
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {!message.complete && (
                  <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1">|</span>
                )}
              </div>
            )}
          </div>
          
          {/* 时间戳 */}
          <div className="mt-1 text-xs text-gray-400">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  )
}

