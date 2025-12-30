"""
iFlow SDK FastAPI 后端服务器
提供 WebSocket 接口连接前端和 iFlow Python SDK
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import asyncio
import json
import os
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

# 如果已安装 iflow-sdk，使用它；否则提供模拟接口
try:
    from iflow_sdk import IFlowClient, IFlowOptions, PermissionMode
    from iflow_sdk import AssistantMessage, ToolCallMessage, PlanMessage, TaskFinishMessage
    IFLOW_AVAILABLE = True
except ImportError:
    IFLOW_AVAILABLE = False
    print("⚠️  iflow-sdk 未安装，使用模拟模式")

app = FastAPI(title="iFlow SDK Web Interface", version="1.0.0")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class ChatMessage(BaseModel):
    role: str  # user, assistant, system
    content: str
    timestamp: str
    message_id: str

class SessionConfig(BaseModel):
    session_id: Optional[str] = None
    permission_mode: str = "auto"  # auto, confirm, deny
    auto_start_process: bool = True

class ConnectionManager:
    """管理 WebSocket 连接"""
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.client_sessions: Dict[str, Any] = {}
    
    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket
    
    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        if client_id in self.client_sessions:
            del self.client_sessions[client_id]
    
    async def send_message(self, client_id: str, message: dict):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_json(message)

manager = ConnectionManager()

# API 路由
@app.get("/")
async def root():
    return {
        "name": "iFlow SDK Web Interface",
        "version": "1.0.0",
        "status": "running",
        "iflow_available": IFLOW_AVAILABLE
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "iflow_sdk_installed": IFLOW_AVAILABLE,
        "active_connections": len(manager.active_connections)
    }

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket 主要端点 - 处理实时通信"""
    await manager.connect(client_id, websocket)
    
    try:
        await manager.send_message(client_id, {
            "type": "connection",
            "status": "connected",
            "client_id": client_id,
            "iflow_available": IFLOW_AVAILABLE,
            "timestamp": datetime.now().isoformat()
        })
        
        while True:
            # 接收客户端消息
            data = await websocket.receive_json()
            message_type = data.get("type")
            
            if message_type == "chat":
                await handle_chat_message(client_id, data)
            elif message_type == "config":
                await handle_config_update(client_id, data)
            elif message_type == "tool_response":
                await handle_tool_response(client_id, data)
            elif message_type == "ping":
                await manager.send_message(client_id, {"type": "pong"})
            else:
                await manager.send_message(client_id, {
                    "type": "error",
                    "message": f"未知的消息类型: {message_type}"
                })
    
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        print(f"客户端断开连接: {client_id}")
    except Exception as e:
        print(f"WebSocket 错误: {str(e)}")
        await manager.send_message(client_id, {
            "type": "error",
            "message": str(e)
        })
        manager.disconnect(client_id)

async def handle_chat_message(client_id: str, data: dict):
    """处理聊天消息"""
    user_message = data.get("message", "")
    config = data.get("config", {})
    
    await manager.send_message(client_id, {
        "type": "message_received",
        "message": user_message,
        "timestamp": datetime.now().isoformat()
    })
    
    if not IFLOW_AVAILABLE:
        # 模拟模式
        await simulate_iflow_response(client_id, user_message)
        return
    
    # 使用真实的 iFlow SDK
    try:
        permission_mode_map = {
            "auto": PermissionMode.AUTO,
            "confirm": PermissionMode.CONFIRM,
            "deny": PermissionMode.DENY
        }
        
        options = IFlowOptions(
            permission_mode=permission_mode_map.get(config.get("permission_mode", "auto"), PermissionMode.AUTO),
            auto_start_process=config.get("auto_start_process", True),
            session_id=config.get("session_id")
        )
        
        async with IFlowClient(options) as client:
            await client.send_message(user_message)
            
            async for message in client.receive_messages():
                if isinstance(message, AssistantMessage):
                    await manager.send_message(client_id, {
                        "type": "assistant_chunk",
                        "content": message.chunk.text,
                        "timestamp": datetime.now().isoformat()
                    })
                
                elif isinstance(message, ToolCallMessage):
                    await manager.send_message(client_id, {
                        "type": "tool_call",
                        "tool_id": message.id,
                        "label": message.label,
                        "description": message.description,
                        "status": message.status,
                        "timestamp": datetime.now().isoformat()
                    })
                
                elif isinstance(message, PlanMessage):
                    await manager.send_message(client_id, {
                        "type": "plan",
                        "title": message.title,
                        "tasks": [{"content": task.content, "status": task.status} for task in message.tasks],
                        "timestamp": datetime.now().isoformat()
                    })
                
                elif isinstance(message, TaskFinishMessage):
                    await manager.send_message(client_id, {
                        "type": "task_finish",
                        "timestamp": datetime.now().isoformat()
                    })
                    break
    
    except Exception as e:
        await manager.send_message(client_id, {
            "type": "error",
            "message": f"处理消息时出错: {str(e)}",
            "timestamp": datetime.now().isoformat()
        })

async def simulate_iflow_response(client_id: str, user_message: str):
    """模拟 iFlow 响应（当 SDK 未安装时）"""
    # 模拟思考延迟
    await asyncio.sleep(0.5)
    
    # 模拟流式响应
    response = f"这是一个模拟响应。您说: '{user_message}'。\n\n由于 iflow-sdk 未安装，这是一个演示模式。请安装 iflow-sdk 以使用完整功能。"
    
    for i, char in enumerate(response):
        await manager.send_message(client_id, {
            "type": "assistant_chunk",
            "content": char,
            "timestamp": datetime.now().isoformat()
        })
        await asyncio.sleep(0.02)
    
    # 模拟任务完成
    await asyncio.sleep(0.3)
    await manager.send_message(client_id, {
        "type": "task_finish",
        "timestamp": datetime.now().isoformat()
    })

async def handle_config_update(client_id: str, data: dict):
    """处理配置更新"""
    config = data.get("config", {})
    manager.client_sessions[client_id] = config
    
    await manager.send_message(client_id, {
        "type": "config_updated",
        "config": config,
        "timestamp": datetime.now().isoformat()
    })

async def handle_tool_response(client_id: str, data: dict):
    """处理工具响应（用户确认/拒绝工具调用）"""
    tool_id = data.get("tool_id")
    approved = data.get("approved", False)
    
    await manager.send_message(client_id, {
        "type": "tool_response_received",
        "tool_id": tool_id,
        "approved": approved,
        "timestamp": datetime.now().isoformat()
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

