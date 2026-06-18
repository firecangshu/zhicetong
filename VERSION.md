# 踏歌行智策通 - 版本记录

## 当前版本

- **APK 版本**：v0.0.5
- **项目版本**：V3.1 参赛版
- **AVJ 材料版本**：V1.1
- **更新日期**：2026-06-18

---

## 版本历史（详细区别）

### v0.0.4 (2026-06-18) - 参赛完善版
**分支**: `dev-v2.3` | **提交**: `35a6e2e`

#### 新增功能
- ✅ AVJ 参赛材料完整（11 份 YAML）
- ✅ 商业计划书（MD + DOCX）
- ✅ `VERSION.md` 版本管理系统
- ✅ GitHub 远程仓库配置（`github` remote）

#### 修复问题
- ✅ 修复 `w9-result/index.js:174` 死链接（→ 显示 modal）
- ✅ 修复 `mock-data.js:125,299` 错别字（`评估报报` → `评估报告`）
- ✅ 修复 `project.config.json` 版本号（V2.0 → V3.0）
- ⚠️ **待修复**：`w4-market/index.js:186` `scopeMap` 值拼写（`district`）

#### AVJ 材料修复
- ✅ `domain_prior_ledger.yaml`：规则数 `18条` → `16+4`
- ✅ `project_card.yaml`：`十步` → `九步`，`W1-W10` → `W1-W9`
- ✅ 所有 YAML 文件一致性修复

#### 文件变更
```
新增：VERSION.md
修改：w9-result/index.js, mock-data.js, project.config.json
修改：avj-submission/*.yaml (6个文件)
```

---

### v0.0.3 (2026-06-10) - APK 打包适配版
**分支**: `dev-v2.2` | **提交**: `456b4ad`

#### 新增功能
- ✅ Canvas 2D 图表兼容性修复（APK 打包）
- ✅ 视频文件外置（百度网盘链接）
- ✅ `video/` 目录移出（真机调试大小限制 14MB → 0.67MB）

#### 修复问题
- ✅ 修复 `index.wxss` 中 `.restart-section` 选择器缺失

#### 文件变更
```
删除：video/ 目录
修改：project.config.json, 各页面 video 链接
```

---

### v0.0.2 (2026-06-05) - 九步 SOP 完整版
**分支**: `dev-v2.2` | **提交**: `f7ae33e`

#### 新增功能
- ✅ 九步 SOP 流程完整实现（W1-W9）
- ✅ 腾讯地图 API 接入（POI 搜索）
- ✅ 三层数据溯源体系（API / AI / 手动）
- ✅ `rules.js` 结构化规则引擎
- ✅ `trace.js` 操作追踪系统

#### 技术细节
- 合规引擎：7 条规则（风景名胜区/自然保护区/文物保护/耕地保护/生态保护红线/饮用水水源保护区/自然灾害风险区）
- 空间引擎：4 条规则（landType 加权映射表）
- 经济引擎：3 条规则（ROI/cost/breakdown）
- 市场引擎：4 条规则（competitor/demand/trend/risk）

#### 文件变更
```
新增：utils/rules.js, utils/trace.js
新增：pages/w1-land - pages/w9-result
修改：app.js, app.json, project.config.json
```

---

### v0.0.1 (2026-05-30) - 初始版本
**分支**: `main` | **提交**: `ac75532`

#### 新增功能
- ✅ 基础页面框架（5 个引导页 + 9 个工作页）
- ✅ 微信小程序项目结构
- ✅ `mock-data.js` 模拟数据系统

#### 文件变更
```
初始提交：全部基础文件
```

---

## 版本区别对比表

| 版本 | 日期 | 核心区别 | APK | AVJ | 商业化 |
|------|------|----------|-----|-----|--------|
| v0.0.1 | 2026-05-30 | 基础框架 | ❌ | ❌ | ❌ |
| v0.0.2 | 2026-06-05 | 九步 SOP + 规则引擎 | ❌ | ❌ | ❌ |
| v0.0.3 | 2026-06-10 | APK 适配 + 视频外置 | ✅ | ❌ | ❌ |
| v0.0.4 | 2026-06-18 | AVJ 材料 + 商业计划书 | ✅ | ✅ | ⏳ |

---

## 分支管理策略

### 当前分支
- `main`：稳定版（v0.0.2 基准）
- `dev-v2.2`：APK 打包版（v0.0.3）
- `dev-v2.3`：AVJ 参赛版（v0.0.4，**当前开发分支**）

### 远程仓库
- `origin` → Gitee：https://gitee.com/funnyhouse/zhicetong.git
- `github` → GitHub：https://github.com/firecangshu/zhicetong.git

### 同步策略
**每次版本发布时**：
1. 提交到本地 `dev-v2.3`
2. 推送到 `origin` (Gitee)
3. 推送到 `github` (GitHub)
4. 更新 `VERSION.md`
5. 创建 Git tag：`git tag -a v0.0.4 -m "版本说明"`

---

## 关键节点时间线

| 日期 | 事件 | 版本 | 影响 |
|------|------|------|------|
| 2026-05-30 | 项目启动 | v0.0.1 | 基础框架 |
| 2026-06-05 | 九步流程完成 | v0.0.2 | 核心功能 |
| 2026-06-10 | APK 打包适配 | v0.0.3 | 移动端 |
| 2026-06-12 | AVJ 材料完善 | v0.0.4 | 参赛准备 |
| 2026-06-17 | 商业计划书完成 | v0.0.4 | 商业化 |
| 2026-06-18 | GitHub 存档 | v0.0.4 | 开源备份 |

---

## 待办事项（按优先级）

### 🔴 高优先级（AVJ 合规）
- [ ] 修复 `w4-market/index.js:186` `scopeMap` 拼写（`district`）
- [ ] 添加安全边界声明（W9 成果页底部）
- [ ] 添加开源来源披露文件（`OPENSOURCE.md`）

### 🟡 中优先级（功能完善）
- [ ] 接入真实 API（天地图、气象数据）
- [ ] 大模型训练（腾讯混元 / 通义千问）
- [ ] 用户反馈系统（训练数据收集）

### 🟢 低优先级（长期规划）
- [ ] 多语言支持（英文 / 日文）
- [ ] 付费版本功能设计
- [ ] 商业化变现策略实施

---

## 版本号命名规则

### APK 版本号（x.y.z）
- **x**：重大版本（架构重构）
- **y**：功能版本（新增功能）
- **z**：修复版本（BUG 修复）

### 项目版本号（Vx.y）
- **x**：参赛版本号
- **y**：迭代次数

### 示例
- `v0.0.4` APK = `V3.0` 项目 = `AVJ V1.0` 材料

---

**项目地址**：`C:\Users\User\WorkBuddy\2026-05-28-13-07-15\版本库\参赛演示版本zhicetong - 副本`
**GitHub 仓库**：https://github.com/firecangshu/zhicetong.git
**Gitee 仓库**：https://gitee.com/funnyhouse/zhicetong.git
