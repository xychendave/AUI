#!/bin/bash

# iFlow SDK Web Interface 启动脚本

echo "🚀 启动 iFlow SDK Web Interface"
echo "================================"

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python 3"
    echo "请先安装 Python 3.8 或更高版本"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js 18 或更高版本"
    exit 1
fi

echo ""
echo "📦 检查并安装依赖..."

# 安装后端依赖
echo "→ 安装后端依赖..."
cd backend
if [ ! -d "venv" ]; then
    echo "  创建虚拟环境..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt
cd ..

# 安装前端依赖
echo "→ 安装前端依赖..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

echo ""
echo "✅ 依赖安装完成"
echo ""

# 启动后端
echo "🔧 启动后端服务器 (端口 8000)..."
cd backend
source venv/bin/activate
python server.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 检查后端是否成功启动
if ! curl -s http://localhost:8000/api/health > /dev/null; then
    echo "❌ 后端启动失败，请查看 backend.log"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ 后端服务器启动成功"
echo ""

# 启动前端
echo "🎨 启动前端开发服务器 (端口 3000)..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "================================"
echo "✨ 应用启动成功！"
echo ""
echo "🌐 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:8000"
echo "📚 API 文档: http://localhost:8000/docs"
echo ""
echo "后端 PID: $BACKEND_PID"
echo "前端 PID: $FRONTEND_PID"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "================================"

# 保存 PID 以便后续清理
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务器...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .backend.pid .frontend.pid; echo '✅ 服务器已停止'; exit 0" INT

wait

