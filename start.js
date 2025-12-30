#!/usr/bin/env node

/**
 * iFlow SDK Web Interface 启动脚本 (跨平台)
 */

const { spawn } = require('child_process');
const { platform } = require('os');
const { existsSync } = require('fs');
const path = require('path');

const isWindows = platform() === 'win32';

console.log('🚀 启动 iFlow SDK Web Interface');
console.log('================================\n');

// 检查依赖
console.log('📦 检查依赖...\n');

const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

// 检查后端依赖
if (!existsSync(path.join(backendDir, isWindows ? 'venv' : 'venv'))) {
  console.log('❌ 后端虚拟环境未找到');
  console.log('请运行: cd backend && python -m venv venv && pip install -r requirements.txt\n');
  process.exit(1);
}

// 检查前端依赖
if (!existsSync(path.join(frontendDir, 'node_modules'))) {
  console.log('❌ 前端依赖未安装');
  console.log('请运行: cd frontend && npm install\n');
  process.exit(1);
}

console.log('✅ 依赖检查完成\n');

// 启动后端
console.log('🔧 启动后端服务器 (端口 8000)...');

const pythonCmd = isWindows ? 'python' : 'python3';
const venvActivate = isWindows
  ? path.join(backendDir, 'venv', 'Scripts', 'python.exe')
  : path.join(backendDir, 'venv', 'bin', 'python');

const backend = spawn(venvActivate, ['server.py'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: isWindows
});

backend.on('error', (err) => {
  console.error('❌ 后端启动失败:', err);
  process.exit(1);
});

// 等待后端启动
setTimeout(() => {
  console.log('✅ 后端服务器启动成功\n');

  // 启动前端
  console.log('🎨 启动前端开发服务器 (端口 3000)...\n');

  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: frontendDir,
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (err) => {
    console.error('❌ 前端启动失败:', err);
    backend.kill();
    process.exit(1);
  });

  console.log('================================');
  console.log('✨ 应用启动成功！\n');
  console.log('🌐 前端地址: http://localhost:3000');
  console.log('🔧 后端地址: http://localhost:8000');
  console.log('📚 API 文档: http://localhost:8000/docs\n');
  console.log('按 Ctrl+C 停止服务器');
  console.log('================================\n');

  // 清理函数
  const cleanup = () => {
    console.log('\n🛑 正在停止服务器...');
    backend.kill();
    frontend.kill();
    console.log('✅ 服务器已停止');
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  frontend.on('close', () => {
    backend.kill();
  });

  backend.on('close', () => {
    frontend.kill();
  });
}, 2000);

