# 踏歌行智策通 — 基线规范文档 V1.0

> **目的**：封存当前已定稿的正确状态，防止后续优化/重新导入时发生回归。
> **规则**：任何后续改动，**必须先对照本基线**，禁止直接覆盖。

## 封存状态

| 项目 | 内容 |
|------|------|
| 基线版本 | V1.0 |
| 封存日期 | 2026-05-30 |
| 校验结果 | **全绿通过**（6/6 项 `[OK]`） |
| 校验脚本 | `scripts/validate-baseline.py` |
| 状态 | **已定稿，禁止未经校验的覆盖** |

---

## 一、页面路由与编号规范（已定稿，禁止修改）

### 1.1 页面目录结构（最终正确版）

```
pages/
├── s1-cover/        # S1 封面
├── s2-identity/     # S2 身份认证（业务流程，非工作流）
├── s3-intro/        # S3 产品介绍
├── s4-guide/        # S4 使用指南
├── w1-land/         # W1 地块框选 ⭐ 工作流第一步
├── w2-resource/     # W2 资源调查
├── w3-policy/       # W3 政策引导
├── w4-market/       # W4 市场调研
├── w5-redline/      # W5 法规红线
├── w6-swot/         # W6 SWOT 分析
├── w7-demand/       # W7 需求澄清
├── w8-position/     # W8 战略定位
└── w9-result/       # W9 三向成果
```

### 1.2 app.json pages 顺序（必须与目录名一致）

```json
"pages": [
  "pages/s1-cover/index",
  "pages/s2-identity/index",
  "pages/s3-intro/index",
  "pages/s4-guide/index",
  "pages/w1-land/index",
  "pages/w2-resource/index",
  "pages/w3-policy/index",
  "pages/w4-market/index",
  "pages/w5-redline/index",
  "pages/w6-swot/index",
  "pages/w7-demand/index",
  "pages/w8-position/index",
  "pages/w9-result/index"
]
```

### 1.3 S 系列 vs W 系列（关键区分，历史回归重灾区）

| 系列 | 性质 | 包含页面 | 说明 |
|------|------|---------|------|
| **S 系列** | 业务流程（前置） | S1~S4 | 封面→认证→介绍→指南，**不属于工作流** |
| **W 系列** | 工作流（核心） | W1~W9 | 地块框选→...→三向成果，**工作流主体** |

⚠️ **历史回归问题记录**：
- 曾错误将"W1 身份认证"加入工作流步骤条 → 正确：W1 是"地块框选"
- 曾错误在步骤条中保留"认证"步骤 → 正确：认证（S2）不属于 W 工作流
- 修改方法：S 系列页面放在 W 系列**之前**，但**不进入 W 步骤条**

---

## 二、步骤条规范（已定稿，禁止修改）

### 2.1 W 工作流步骤条（9 步，无认证）

**正确版本**（每个 w* 页面的步骤条必须与此一致）：

```
W1 地块框选 → W2 资源调查 → W3 政策引导 → W4 市场调研
→ W5 法规红线 → W6 SWOT → W7 需求澄清 → W8 战略定位 → W9 三向成果
```

**步骤条数据结构**（s4-guide 的 timelineSteps，其他 w* 页面步骤条同理）：

```javascript
timelineSteps: [
  { step: 1, phase: 'W1 地块框选', tag: '地块', tagType: 'green', ... },
  { step: 2, phase: 'W2 资源调查', tag: '资源', tagType: 'green', ... },
  { step: 3, phase: 'W3 政策引导', tag: '政策', tagType: 'orange', ... },
  { step: 4, phase: 'W4 市场调研', tag: '市场', tagType: 'orange', ... },
  { step: 5, phase: 'W5 法规红线', tag: '红线', tagType: 'red', ... },
  { step: 6, phase: 'W6 SWOT', tag: '分析', tagType: 'purple', ... },
  { step: 7, phase: 'W7 需求澄清', tag: '需求', tagType: 'purple', ... },
  { step: 8, phase: 'W8 战略定位', tag: '定位', tagType: 'blue', ... },
  { step: 9, phase: 'W9 三向成果', tag: '成果', tagType: 'green', ... }
]
// ⚠️ 禁止包含任何"认证"相关步骤
```

### 2.2 步骤条 WXML 结构规范

每个 `pages/w*/index.wxml` 中的步骤条必须用以下结构（以 9 步为例）：

```xml
<scroll-view scroll-x class="step-scroll">
  <view class="step-bar">
    <view class="step-item {{currentStep === 1 ? 'active' : ''}}">W1 地块</view>
    <view class="step-item {{currentStep === 2 ? 'active' : ''}}">W2 资源</view>
    <view class="step-item {{currentStep === 3 ? 'active' : ''}}">W3 政策</view>
    <view class="step-item {{currentStep === 4 ? 'active' : ''}}">W4 市场</view>
    <view class="step-item {{currentStep === 5 ? 'active' : ''}}">W5 法规</view>
    <view class="step-item {{currentStep === 6 ? 'active' : ''}}">W6 SWOT</view>
    <view class="step-item {{currentStep === 7 ? 'active' : ''}}">W7 需求</view>
    <view class="step-item {{currentStep === 8 ? 'active' : ''}}">W8 定位</view>
    <view class="step-item {{currentStep === 9 ? 'active' : ''}}">W9 成果</view>
  </view>
</scroll-view>
```

⚠️ **历史回归问题**：
- 曾错误生成 10 步步骤条（多了"W1 认证"）→ 正确：必须是 9 步
- 曾错误在 wxml 中保留认证相关 view → 正确：所有 w* 页面步骤条**不含认证**

---

## 三、JS 跳转路径规范（已定稿，禁止修改）

### 3.1 页面跳转关系（完整链路）

```
S1封面 → S2认证 → S3介绍 → S4指南
                           ↓
                      W1地块 → W2资源 → W3政策 → W4市场
                                              ↓
                                      W5法规 → W6SWOT → W7需求 → W8定位
                                                                  ↓
                                                             W9成果
```

### 3.2 各页面跳转代码（必须与此一致）

**s4-guide/index.js**：
```javascript
onConfirmAndNext() {
  wx.navigateTo({ url: '/pages/w1-land/index' })  // ⚠️ 跳 W1，不是 W2
}
```

**w1-land/index.js**：
```javascript
onConfirmAndNext() {
  wx.navigateTo({ url: '/pages/w2-resource/index' })
}
```

**w2-resource/index.js** → `/pages/w3-policy/index`  
**w3-policy/index.js** → `/pages/w4-market/index`  
**w4-market/index.js** → `/pages/w5-redline/index`  
**w5-redline/index.js** → `/pages/w6-swot/index`  
**w6-swot/index.js** → `/pages/w7-demand/index`  
**w7-demand/index.js** → `/pages/w8-position/index`  
**w8-position/index.js** → `/pages/w9-result/index`  

⚠️ **历史回归问题**：
- 曾错误将跳转目标写成旧编号（如 w2-land）→ 正确：必须用**当前目录名**（w1-land）
- 修改方法：目录重命名后，**必须同步修改所有 JS 跳转路径**

---

## 四、数据架构规范（已定稿）

### 4.1 三层数据源架构

```
优先级：官方API > AI聚合 > 人工修正
```

每个数据字段的数据结构：
```javascript
{
  value: '字段值',
  sourceType: 'poi' | 'mock' | 'manual',  // 数据来源类型
  sourceName: '具体来源名称',
  manualNote: '人工备注（仅 sourceType="manual" 时填写）'
}
```

### 4.2 mock-data.js 数据Key规范

| 页面 | mockData Key | 说明 |
|------|-------------|------|
| w1-land | `mockData.w1_land` | 地块框选数据 |
| w2-resource | `mockData.w2_resource` | 资源调查数据 |
| w3-policy | `mockData.w3_policy` | 政策引导数据 |
| w4-market | `mockData.w4_market` | 市场调研数据 |
| w5-redline | `mockData.w5_redline` | 法规红线数据 |
| w6-swot | `mockData.w6_swot` | SWOT 分析数据 |
| w7-demand | `mockData.w7_demand` | 需求澄清数据 |
| w8-position | `mockData.w8_position` | 战略定位数据 |
| w9-result | `mockData.w9_result` | 三向成果数据 |

---

## 五、Design System 关键色值（已定稿）

> 来自 Design System V1.0，禁止随意修改

| 用途 | 色值 | 说明 |
|------|------|------|
| 品牌主色 | `#1A6DFF` | 导航栏背景 |
| 成功 | `#00B365` | 完成状态 |
| 警告 | `#F5A623` | 注意状态 |
| 危险 | `#E53935` | 错误/删除 |
| 暂停 | `#8C6BFF` | 暂缓状态 |
| 页面背景 | `#F5F7FA` | 全局背景 |
| 卡片背景 | `#FFFFFF` | 卡片/弹窗 |
| 文字主色 | `#1A1A2E` | **非纯黑** |

**四维色**（步骤条 tag 用）：
- 合规蓝 `#1A6DFF` | 空间绿 `#00B365` | 经济橙 `#F5A623` | 市场紫 `#8C6BFF`

---

## 六、回归历史问题清单（已知坑，禁止再踩）

| # | 问题 | 正确状态 | 错误状态 |
|---|------|---------|---------|
| 1 | 步骤条步数 | 9 步（W1~W9） | 10 步（多了"认证"） |
| 2 | 步骤条内容 | 无"认证" | 含"W1 认证" |
| 3 | W1 定义 | 地块框选 | 身份认证 |
| 4 | S系列是否入工作流 | 否 | 是（错误） |
| 5 | JS跳转路径 | 用当前目录名 | 用旧编号（如w2-land） |
| 6 | app.json顺序 | s1~s4, w1~w9 | 含w10-result（已删除） |
| 7 | 嵌套目录 | 无 | `w9-result/w10-result/`（已清理） |
| 8 | Python脚本编码 | UTF-8 | GBK/GB18030（错误） |
| 9 | WXSS 文件注释 | `/* pages/w9-result/ */` | `/* pages/w10-result/ */`（注释残留） |
| 10 | 备份文件管理 | 无 .bak/.bak2 文件 | s1-cover 下存在 .bak/.bak2（回归源） |

---

## 七、基线版本记录

| 版本 | 日期 | 说明 |
|------|------|------|
| V1.0 | 2026-05-30 | 首次封存：小程序端基本定稿，SOP十步流程+工作流W1~W9 |

---

> **⚠️ 使用本基线的规则**：
> 1. 任何后续优化，**先对照本基线文档**
> 2. 修改后**必须运行回归检查清单**（见 `docs/REGRESSION-CHECKLIST.md`）
> 3. 发现新问题**立即更新本基线**（新增历史回归问题）
> 4. 重新导入项目后**必须运行基线校验脚本**（见 `scripts/validate-baseline.py`）
