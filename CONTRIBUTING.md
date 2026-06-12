# Contributing to 踏歌行智策通

感谢你的兴趣！以下是如何为踏歌行智策通项目做出贡献的指南。

---

## 📋 目录

- [如何贡献](#如何贡献)
- [代码规范](#代码规范)
- [提交信息规范](#提交信息规范)
- [测试指南](#测试指南)
- [问题反馈](#问题反馈)
- [联系方式](#联系方式)

---

## 如何贡献

### 🐛 报告Bug

1. 检查 [Issue列表](https://gitee.com/funnyhouse/zhicetong/issues) 确认Bug未被报告
2. 创建新Issue，使用"Bug报告"模板
3. 包含以下信息：
   - **复现步骤**（尽量详细）
   - **预期行为**
   - **实际行为**
   - **截图**（如果有）
   - **设备信息**（微信版本、系统版本）

### 💡 建议功能

1. 创建新Issue，使用"功能建议"模板
2. 说明以下信息：
   - **功能描述**（你想要什么功能？）
   - **使用场景**（为什么需要这个功能？）
   - **预期效果**（这个功能应该怎么做？）

### 🔧 提交代码

1. **Fork本仓库**
   ```bash
   # 在Gitee上点击Fork按钮
   ```

2. **创建特性分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **提交更改**
   ```bash
   git commit -m 'feat: Add some amazing feature'
   ```

4. **推送到分支**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **提交Pull Request**
   - 到Gitee上创建PR
   - 填写PR模板
   - 等待审查

---

## 代码规范

### 缩进

- **2空格缩进**（微信小程序官方推荐）

```javascript
// ✅ 正确
function evaluate() {
  var score = 0;
  if (condition) {
    score += 10;
  }
  return score;
}

// ❌ 错误
function evaluate() {
    var score = 0;  // 4空格，错误
    return score;
}
```

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| **变量/函数** | camelCase | `evaluateCompliance` |
| **常量** | UPPER_SAKE | `MAX_SCORE` |
| **组件目录** | kebab-case | `s1-cover/` |
| **类名** | PascalCase | `EngineEvaluator` |

### 注释规范

```javascript
/**
 * 评估合规维度
 * @param {Object} params - 输入参数
 * @param {string} params.redline - 生态红线情况
 * @param {string} params.farm - 耕地保护情况
 * @returns {Object} 合规评分结果
 */
function evaluateCompliance(params) {
  // 实现逻辑...
}
```

---

## 提交信息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 格式。

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型（type）

| 类型 | 说明 |
|------|------|
| **feat** | 新功能 |
| **fix** | 修复Bug |
| **docs** | 文档变更 |
| **chore** | 构建/工具变更 |
| **refactor** | 重构（不改变功能的代码变更） |
| **test** | 添加测试 |
| **perf** | 性能优化 |

### 示例

```bash
# 新功能
git commit -m "feat: 添加腾讯地图POI数据获取功能"

# 修复Bug
git commit -m "fix: 修复W9结果页评分显示错误的Bug"

# 文档变更
git commit -m "docs: 更新README.md添加使用说明"

# 构建/工具变更
git commit -m "chore: 添加.gitignore忽略规则"
```

---

## 测试指南

### 手动测试

1. **打开微信开发者工具**
2. **导入项目**
   - 选择项目目录
   - 填入AppID（或选择测试号）
3. **编译运行**
   - 点击"编译"按钮
   - 在模拟器中查看效果
4. **测试相关功能**
   - 按SOP十步流程逐步测试
   - 检查每个页面的输入/输出
   - 检查评分结果是否正确

### 提交前检查

- [ ] 代码符合规范（2空格缩进）
- [ ] 提交信息符合Conventional Commits
- [ ] 手动测试通过
- [ ] 文档已更新（如需要）

---

## 问题反馈

### 遇到问题？

1. **查看文档**
   - [README.md](README.md)
   - [CHANGELOG.md](CHANGELOG.md)
   - [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

2. **搜索Issue**
   - 在 [Issue列表](https://gitee.com/funnyhouse/zhicetong/issues) 搜索是否已有相同问题

3. **创建新Issue**
   - 描述你的问题
   - 包含复现步骤
   - 包含截图（如果有）

---

## 联系方式

- **仓库地址**：[https://gitee.com/funnyhouse/zhicetong](https://gitee.com/funnyhouse/zhicetong)
- **Issue追踪**：[https://gitee.com/funnyhouse/zhicetong/issues](https://gitee.com/funnyhouse/zhicetong/issues)
- **电子邮件**：funnyhouse@example.com（请联系仓库Owner获取）

---

## 许可证

通过贡献你的代码，你同意你的贡献将在MIT许可证下授权。

---

**感谢你的贡献！** 🎉
