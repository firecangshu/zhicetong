# Changelog

本文档记录踏歌行智策通项目的所有显著变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [2.1.0] - 2026-06-11 (AVJ对齐版)

### ✨ Added (新增功能)
- **AVJ框架对齐**：添加 `avj-submission/` 目录，包含11个YAML文件
  - `project_card.yaml` - 项目卡片
  - `domain_prior_ledger.yaml` - 领域先验账本（18条规则）
  - `execution_protocols.yaml` - 执行协议（SOP十步）
  - `evidence_map.yaml` - 证据映射
  - `open_source_provenance.yaml` - 开源出处
  - `feedback_loop.yaml` - 反馈循环
  - `adaptation.yaml` - 个体化适配
  - `expert_collaboration.yaml` - 专家协作
  - `social_civilization.yaml` - 社会价值
  - `safety_boundary.yaml` - 安全边界
  - `risk_flags.yaml` - 风险标记
- **规则结构化**：创建 `utils/rules.json`（18条结构化规则）
- **决策日志**：创建 `utils/trace.js`（记录评分输入输出）
- **Git忽略文件**：创建 `.gitignore`
- **开源许可证**：添加 `LICENSE`（MIT License）

### 🔄 Changed (功能变更)
- **评分引擎改造**：`utils/engine.js` 改造为从 `rules.json` 加载规则
- **文档重写**：`README.md` 重写为AVJ视角

### 📝 Known Issues (已知问题)
- `engine.js` 未被页面调用（静态资产）
- `trace.js` 未被集成（静态资产）
- 无真实API接入（使用mock数据）
- 证据等级E1
- APK基于旧代码（V2.0）

---

## [2.0.0] - 2026-06-01

### ✨ Added (新增功能)
- **四维评分引擎**：合规×空间×经济×市场
- **SOP十步选址流程**：从需求输入到报告导出
- **三层数据架构**：POI + Mock + Manual
- **13个页面**：S1-S4（流程控制）+ W1-W9（工作页面）
- **Design System V1.0**：品牌色、字体、间距系统
- **数据模拟系统**：`utils/mock-data.js`
- **数据获取模块**：`utils/fetcher.js`
- **关键词映射**：`utils/keyword-mapping.js`

### 🎨 Features (功能特性)
- 智能评估系统（四维评分）
- 结果解释和建议
- 报告生成（模拟）
- 数据导出（模拟）
- 设置页面（模拟API配置）

### 📝 Known Issues (已知问题)
- 无真实API接入
- 无用户验证系统
- 报告导出为模拟功能
- 数据导出为模拟功能

---

## [1.0.0] - 2026-05-15 (原型版)

### ✨ Added (新增功能)
- 初始项目骨架
- 基础页面结构
- 简单的评分逻辑（硬编码）
- 静态演示数据

### 📝 Known Issues (已知问题)
- 功能不完整
- 无评分引擎
- 无SOP流程
- 纯静态演示

---

## 图例

- ✨ **Added** - 新功能
- 🔄 **Changed** - 现有功能的变更
- ⚠️ **Deprecated** - 即将移除的功能
- ❌ **Removed** - 已移除的功能
- 🐛 **Fixed** - 任何bug修复
- 🔒 **Security** - 安全相关修复
- 📝 **Known Issues** - 已知问题（非标准，但有用）

---

**仓库地址**：https://gitee.com/funnyhouse/zhicetong  
**最新版本**：V2.1.0（AVJ对齐版）  
**最后更新**：2026-06-11
