# 踏歌行智策通 — 回归检查清单

> **使用方法**：每次重新导入项目、部署前、优化后，**逐项打勾**。
> 任何一项不通过，**禁止发布**。

---

## 检查清单 V1.0（对应基线：BASELINE.md V1.0）

---

### 一、页面目录结构检查

- [ ] `pages/` 下目录列表**必须**是：
  ```
  s1-cover, s2-identity, s3-intro, s4-guide,
  w1-land, w2-resource, w3-policy, w4-market,
  w5-redline, w6-swot, w7-demand, w8-position, w9-result
  ```
- [ ] **禁止**存在 `w10-result` 目录（历史残留，已删除）
- [ ] **禁止**存在嵌套目录 `w9-result/w10-result/`（历史回归问题 #7）

---

### 二、app.json 检查

- [ ] `app.json` 的 `pages` 数组**必须**与目录结构一致（见上）
- [ ] **禁止**包含 `pages/w10-result/index`（历史回归问题 #6）
- [ ] 路径顺序：s1~s4 在前，w1~w9 在后

---

### 三、步骤条检查（核心回归区）

#### 3.1 s4-guide 的 timelineSteps

- [ ] `timelineSteps` 数组长度为 **9**（不是 10）
- [ ] **禁止**包含任何含"认证"的 step 对象
- [ ] 第一个 step 的 `phase` 是 `'W1 地块框选'`（不是"认证"）
- [ ] step 编号：1~9 连续，无缺失无重复

#### 3.2 所有 w* 页面的 wxml 步骤条

逐个检查以下文件中的 `<scroll-view>...</scroll-view>` 块：

| 文件 | 步骤条步数 | 是否含"认证" |
|------|-----------|--------------|
| `pages/w1-land/index.wxml` | 9 步 | ❌ 禁止 |
| `pages/w2-resource/index.wxml` | 9 步 | ❌ 禁止 |
| `pages/w3-policy/index.wxml` | 9 步 | ❌ 禁止 |
| `pages/w4-market/index.wxml` | 9 步 | ❌ 禁止 |
| `pages/w5-redline/index.wxml` | 9 步 | ❌ 禁止 |
| `pages/w6-swot/index.wxml` | 9 步 | ❌ 禁止 |
| `pages/w7-demand/index.wxml` | 9 步 | ❌ 禁止 |
| `pages/w8-position/index.wxml` | 9 步 | ❌ 禁止 |
| `pages/w9-result/index.wxml` | 9 步 | ❌ 禁止 |

- [ ] 所有 9 个文件步骤条步数 = 9
- [ ] 所有 9 个文件步骤条**不含**"认证"文字
- [ ] 步骤条第一步文字是"W1 地块"（不是"W1 认证"）

---

### 四、JS 跳转路径检查

| 文件 | 预期跳转目标 | 检查 |
|------|------------|------|
| `s4-guide/index.js` | `/pages/w1-land/index` | |
| `w1-land/index.js` | `/pages/w2-resource/index` | |
| `w2-resource/index.js` | `/pages/w3-policy/index` | |
| `w3-policy/index.js` | `/pages/w4-market/index` | |
| `w4-market/index.js` | `/pages/w5-redline/index` | |
| `w5-redline/index.js` | `/pages/w6-swot/index` | |
| `w6-swot/index.js` | `/pages/w7-demand/index` | |
| `w7-demand/index.js` | `/pages/w8-position/index` | |
| `w8-position/index.js` | `/pages/w9-result/index` | |

- [ ] **禁止**任何跳转目标包含 `w10`（历史残留）
- [ ] **禁止**任何跳转目标使用旧目录名（如 `w2-land`，正确是 `w1-land`）

---

### 五、编译检查（微信开发者工具）

- [ ] 编译**无** `ENOENT` 错误
- [ ] 编译**无** `w10-result` 相关错误
- [ ] 所有页面可正常打开（S1→S2→S3→S4→W1→...→W9）

---

### 六、视觉检查（真机/模拟器）

- [ ] S4 指南页步骤条显示 9 步，无"认证"
- [ ] W1 地块框选页步骤条：W1 高亮，无"认证"
- [ ] W9 成果页步骤条：W9 高亮，无"认证"
- [ ] 所有步骤条 tag 颜色与 BASELINE.md 第四节一致

---

## 检查记录

| 检查日期 | 检查人 | 结果 | 备注 |
|---------|-------|------|------|
| 2026-05-30 | AI | ✅ 通过 | 基线封存 |
| | | | |

---

> **⚠️ 检查不通过的处理流程**：
> 1. 记录失败项编号（如"三-3.2，w2-resource 步骤条含认证"）
> 2. 运行 `scripts/validate-baseline.py` 自动定位问题
> 3. 修复后**重新跑完整检查清单**，不能只修不检查
> 4. 修复完成后**更新** `docs/BASELINE.md` 历史回归问题清单（如有新问题）
