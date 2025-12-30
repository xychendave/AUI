import { Config } from '../types'
import { X, Shield, Play, Hash } from 'lucide-react'

interface ConfigPanelProps {
  config: Config
  onConfigChange: (config: Config) => void
  onClose: () => void
}

export default function ConfigPanel({ config, onConfigChange, onClose }: ConfigPanelProps) {
  const handlePermissionModeChange = (mode: 'auto' | 'confirm' | 'deny') => {
    onConfigChange({ ...config, permission_mode: mode })
  }

  const handleAutoStartChange = (autoStart: boolean) => {
    onConfigChange({ ...config, auto_start_process: autoStart })
  }

  const handleSessionIdChange = (sessionId: string) => {
    onConfigChange({ ...config, session_id: sessionId || null })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">配置</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 权限模式 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <label className="block text-sm font-medium text-gray-700">
                权限模式
              </label>
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="permission"
                  checked={config.permission_mode === 'auto'}
                  onChange={() => handlePermissionModeChange('auto')}
                  className="w-4 h-4 text-primary-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">自动 (Auto)</div>
                  <div className="text-xs text-gray-500">自动批准所有工具调用</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="permission"
                  checked={config.permission_mode === 'confirm'}
                  onChange={() => handlePermissionModeChange('confirm')}
                  className="w-4 h-4 text-primary-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">确认 (Confirm)</div>
                  <div className="text-xs text-gray-500">每次工具调用前需要确认</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="permission"
                  checked={config.permission_mode === 'deny'}
                  onChange={() => handlePermissionModeChange('deny')}
                  className="w-4 h-4 text-primary-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">拒绝 (Deny)</div>
                  <div className="text-xs text-gray-500">禁止所有工具调用</div>
                </div>
              </label>
            </div>
          </div>

          {/* 自动启动进程 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Play className="w-5 h-5 text-gray-600" />
              <label className="block text-sm font-medium text-gray-700">
                进程管理
              </label>
            </div>
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={config.auto_start_process}
                onChange={(e) => handleAutoStartChange(e.target.checked)}
                className="w-4 h-4 text-primary-600"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">自动启动 iFlow 进程</div>
                <div className="text-xs text-gray-500">
                  SDK 会自动启动和管理 iFlow CLI 进程
                </div>
              </div>
            </label>
          </div>

          {/* 会话 ID */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Hash className="w-5 h-5 text-gray-600" />
              <label className="block text-sm font-medium text-gray-700">
                会话 ID (可选)
              </label>
            </div>
            <input
              type="text"
              value={config.session_id || ''}
              onChange={(e) => handleSessionIdChange(e.target.value)}
              placeholder="留空以创建新会话"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              输入现有会话 ID 以继续之前的对话
            </p>
          </div>
        </div>

        {/* 底部 */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}

