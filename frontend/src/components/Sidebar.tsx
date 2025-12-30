import { ToolCall, Plan } from '../types'
import { Wifi, WifiOff, Trash2, Wrench, ListChecks } from 'lucide-react'

interface SidebarProps {
  isConnected: boolean
  connectionStatus: string
  toolCalls: ToolCall[]
  plans: Plan[]
  onClearChat: () => void
}

export default function Sidebar({ isConnected, connectionStatus, toolCalls, plans, onClearChat }: SidebarProps) {
  const getStatusColor = () => {
    if (isConnected) return 'text-green-500'
    if (connectionStatus === 'connecting') return 'text-yellow-500'
    return 'text-red-500'
  }

  const getStatusText = () => {
    if (isConnected) return '已连接'
    if (connectionStatus === 'connecting') return '连接中'
    return '未连接'
  }

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* 连接状态 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className={`w-5 h-5 ${getStatusColor()}`} />
          ) : (
            <WifiOff className={`w-5 h-5 ${getStatusColor()}`} />
          )}
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* 工具调用 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Wrench className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">工具调用</h3>
          </div>
          
          {toolCalls.length === 0 ? (
            <p className="text-sm text-gray-400">暂无工具调用</p>
          ) : (
            <div className="space-y-2">
              {toolCalls.map((tool) => (
                <div
                  key={tool.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{tool.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tool.status === 'completed' 
                        ? 'bg-green-100 text-green-700'
                        : tool.status === 'running'
                        ? 'bg-blue-100 text-blue-700'
                        : tool.status === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tool.status === 'completed' ? '完成' :
                       tool.status === 'running' ? '运行中' :
                       tool.status === 'failed' ? '失败' : '等待'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{tool.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 任务计划 */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <ListChecks className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">任务计划</h3>
          </div>
          
          {plans.length === 0 ? (
            <p className="text-sm text-gray-400">暂无任务计划</p>
          ) : (
            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <h4 className="font-medium text-sm mb-2">{plan.title}</h4>
                  <ul className="space-y-1">
                    {plan.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs">
                        <span className={`inline-block w-4 h-4 rounded-full flex-shrink-0 mt-0.5 ${
                          task.status === 'completed'
                            ? 'bg-green-500'
                            : task.status === 'in_progress'
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}></span>
                        <span className="flex-1">{task.content}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onClearChat}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>清空对话</span>
        </button>
      </div>
    </aside>
  )
}

