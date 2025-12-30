@echo off
REM iFlow SDK Web Interface 启动脚本 (Windows)

echo 🚀 启动 iFlow SDK Web Interface
echo ================================
echo.

REM 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Python
    echo 请先安装 Python 3.8 或更高版本
    pause
    exit /b 1
)

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Node.js
    echo 请先安装 Node.js 18 或更高版本
    pause
    exit /b 1
)

echo 📦 检查并安装依赖...
echo.

REM 安装后端依赖
echo → 安装后端依赖...
cd backend
if not exist "venv" (
    echo   创建虚拟环境...
    python -m venv venv
)
call venv\Scripts\activate
pip install -q -r requirements.txt
cd ..

REM 安装前端依赖
echo → 安装前端依赖...
cd frontend
if not exist "node_modules" (
    npm install
)
cd ..

echo.
echo ✅ 依赖安装完成
echo.

REM 启动后端
echo 🔧 启动后端服务器 (端口 8000)...
cd backend
call venv\Scripts\activate
start /B python server.py > ..\backend.log 2>&1
cd ..

REM 等待后端启动
timeout /t 3 /nobreak >nul

echo ✅ 后端服务器启动成功
echo.

REM 启动前端
echo 🎨 启动前端开发服务器 (端口 3000)...
cd frontend
start /B npm run dev > ..\frontend.log 2>&1
cd ..

echo.
echo ================================
echo ✨ 应用启动成功！
echo.
echo 🌐 前端地址: http://localhost:3000
echo 🔧 后端地址: http://localhost:8000
echo 📚 API 文档: http://localhost:8000/docs
echo.
echo 按任意键停止服务器...
echo ================================

pause >nul

REM 停止服务器
echo.
echo 🛑 正在停止服务器...
taskkill /F /IM python.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1
echo ✅ 服务器已停止

pause

