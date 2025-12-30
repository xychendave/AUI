export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  complete: boolean
}

export interface ToolCall {
  id: string
  label: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  timestamp: Date
}

export interface Plan {
  id: string
  title: string
  tasks: Array<{
    content: string
    status: 'pending' | 'in_progress' | 'completed'
  }>
  timestamp: Date
}

export interface Config {
  permission_mode: 'auto' | 'confirm' | 'deny'
  auto_start_process: boolean
  session_id: string | null
}

export interface WebSocketMessage {
  type: string
  [key: string]: any
}

