# 贡献指南

感谢你对 iFlow SDK Web Interface 的关注！我们欢迎各种形式的贡献。

## 🤝 如何贡献

### 报告 Bug

如果你发现了 bug，请创建一个 Issue 并包含：
- 详细的问题描述
- 复现步骤
- 期望的行为
- 实际的行为
- 系统环境信息 (OS, Node.js, Python 版本)
- 相关的错误日志

### 提出新功能

我们欢迎新功能建议！请创建一个 Issue 并说明：
- 功能的用途和价值
- 期望的用户体验
- 可能的实现方案

### 提交 Pull Request

1. **Fork 仓库**
   ```bash
   git clone https://github.com/yourusername/iflow_sdk.git
   cd iflow_sdk
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **开发和测试**
   - 遵循现有的代码风格
   - 添加必要的注释
   - 确保代码可以正常运行
   - 测试你的更改

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加某某功能"
   ```

   提交信息格式：
   - `feat:` 新功能
   - `fix:` 修复 bug
   - `docs:` 文档更新
   - `style:` 代码格式调整
   - `refactor:` 代码重构
   - `test:` 测试相关
   - `chore:` 构建/工具相关

5. **推送并创建 PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   然后在 GitHub 上创建 Pull Request

## 💻 开发环境设置

### 前端开发

```bash
cd frontend

# 安装依赖
npm install

# 开发模式 (热重载)
npm run dev

# 代码检查
npm run lint

# 构建生产版本
npm run build
```

### 后端开发

```bash
cd backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 开发模式 (自动重载)
uvicorn server:app --reload

# 查看 API 文档
# 访问 http://localhost:8000/docs
```

## 📝 代码风格

### TypeScript/React
- 使用 TypeScript 的严格模式
- 遵循 ESLint 配置
- 组件使用函数式组件和 Hooks
- 使用有意义的变量和函数名
- 添加适当的类型注解

### Python
- 遵循 PEP 8 风格指南
- 使用类型提示
- 编写清晰的文档字符串
- 函数和类名使用描述性命名

## 🧪 测试

目前项目还没有完整的测试套件，这是一个很好的贡献机会！

我们欢迎为以下方面添加测试：
- 前端组件测试
- WebSocket 连接测试
- API 端点测试
- 集成测试

## 📚 文档

文档同样重要！你可以帮助：
- 改进现有文档
- 添加使用示例
- 创建教程
- 翻译文档到其他语言

## ❓ 问题和讨论

有问题或想法？欢迎：
- 创建 GitHub Issue
- 参与 GitHub Discussions
- 查看现有的 Issues 和 PRs

## 📄 许可证

贡献的代码将采用与项目相同的 MIT 许可证。

---

感谢你的贡献！🙏

