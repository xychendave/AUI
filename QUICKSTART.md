# 快速入门指南

## 🚀 5 分钟快速开始

### 步骤 1: 安装依赖

**后端依赖:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

**前端依赖:**
```bash
cd frontend
npm install
cd ..
```

### 步骤 2: 启动应用

**方法 1: 使用启动脚本 (推荐)**

**Mac/Linux:**
```bash
./start.sh
```

**Windows:**
```bash
start.bat
```

**方法 2: 手动启动**

**终端 1 - 后端:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python server.py
```

**终端 2 - 前端:**
```bash
cd frontend
npm run dev
```

### 步骤 3: 开始使用

1. 在浏览器中打开 `http://localhost:3000`
2. 输入你的第一个问题，例如："你好，介绍一下你自己"
3. 观察 AI 的实时响应！

## 📱 界面说明

### 主界面布局

```
┌─────────────┬──────────────────────────┬──────────┐
│             │   顶部栏                  │  设置 ⚙️  │
│  侧边栏     ├──────────────────────────┤          │
│             │                          │          │
│  🔗 连接状态 │   聊天消息区域            │          │
│  🔧 工具调用 │                          │          │
│  📋 任务计划 │                          │          │
│             ├──────────────────────────┤          │
│             │   输入框                  │          │
│  🗑️ 清空对话 │   [发送按钮]              │          │
└─────────────┴──────────────────────────┴──────────┘
```

### 功能介绍

#### 💬 聊天功能
- **发送消息**: 输入文本后按 `Enter` 发送
- **换行**: `Shift + Enter` 在消息中换行
- **流式响应**: AI 回复会实时显示，如同打字效果
- **Markdown 支持**: 支持代码块、列表、粗体等格式

#### 🔧 工具调用监控
左侧边栏实时显示 AI 调用的工具：
- 🟢 **完成** - 工具执行成功
- 🔵 **运行中** - 工具正在执行
- 🔴 **失败** - 工具执行失败
- ⚪ **等待** - 等待执行

#### 📋 任务计划
AI 规划的任务会显示在左侧边栏：
- 🟢 已完成
- 🔵 进行中
- ⚪ 未开始

#### ⚙️ 配置选项
点击右上角的设置图标可以配置：

**1. 权限模式**
- **自动**: 自动批准所有工具调用（推荐）
- **确认**: 每次工具调用前需要你的确认
- **拒绝**: 禁止所有工具调用

**2. 进程管理**
- ✅ **自动启动 iFlow 进程**: SDK 会自动管理 iFlow CLI
- ⬜ **手动管理**: 需要你自己启动 iFlow CLI

**3. 会话管理**
- 输入会话 ID 可以恢复之前的对话
- 留空将创建新的会话

## 💡 使用示例

### 示例 1: 简单对话
```
你: 什么是 Python？
AI: Python 是一种高级编程语言...
```

### 示例 2: 代码生成
```
你: 写一个 Python 函数计算斐波那契数列
AI: 好的，这里是一个计算斐波那契数列的函数：
    def fibonacci(n):
        if n <= 1:
            return n
        return fibonacci(n-1) + fibonacci(n-2)
```

### 示例 3: 文件操作
```
你: 创建一个名为 test.txt 的文件
AI: [调用文件创建工具]
    ✅ 文件创建成功
```

## 🐛 常见问题

### 问题 1: 无法连接到服务器
**解决方案:**
- 确保后端服务器正在运行 (http://localhost:8000)
- 检查端口 8000 和 3000 是否被占用
- 查看 `backend.log` 和 `frontend.log` 日志文件

### 问题 2: iFlow SDK 未安装
**解决方案:**
```bash
pip install iflow-sdk
```
或者在模拟模式下继续使用（功能有限）

### 问题 3: 前端依赖安装失败
**解决方案:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 问题 4: Python 虚拟环境问题
**解决方案:**
```bash
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 🎯 下一步

- 📖 阅读完整文档: [README.md](README.md)
- 🔍 查看 API 文档: http://localhost:8000/docs
- 🌐 访问 iFlow SDK: https://pypi.org/project/iflow-sdk/
- 🛠️ 自定义配置和样式

## 📧 需要帮助？

如有问题，请：
1. 查看日志文件 (`backend.log`, `frontend.log`)
2. 检查浏览器控制台错误
3. 访问 iFlow SDK 文档

---

祝使用愉快！ 🎉

