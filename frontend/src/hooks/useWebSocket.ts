import { useEffect, useRef, useState, useCallback } from 'react'
import { WebSocketMessage, Config } from '../types'

interface UseWebSocketOptions {
  onMessage: (data: any) => void
  config: Config
}

export function useWebSocket({ onMessage, config }: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected')
  const wsRef = useRef<WebSocket | null>(null)
  const clientIdRef = useRef<string>(generateClientId())
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttemptsRef = useRef(0)

  const connect = useCallback(() => {
    try {
      // 在开发环境中直接连接到后端，避免 Vite 代理问题
      const isDev = import.meta.env.DEV
      const wsUrl = isDev 
        ? `ws://localhost:8000/ws/${clientIdRef.current}`
        : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/${clientIdRef.current}`
      
      setConnectionStatus('connecting')
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setConnectionStatus('connected')
        reconnectAttemptsRef.current = 0
        
        // 发送配置
        ws.send(JSON.stringify({
          type: 'config',
          config
        }))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('Received message:', data)
          onMessage(data)
        } catch (error) {
          console.error('Failed to parse message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus('error')
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        setConnectionStatus('disconnected')
        
        // 尝试重连
        if (reconnectAttemptsRef.current < 5) {
          reconnectAttemptsRef.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000)
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        }
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Failed to connect:', error)
      setConnectionStatus('error')
    }
  }, [config, onMessage])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connect])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }, [])

  return {
    isConnected,
    connectionStatus,
    sendMessage
  }
}

function generateClientId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

