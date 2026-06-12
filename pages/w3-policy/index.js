// pages/w4-policy/index.js
// W4 政策引导 V2.8 四级政策库版
const { mockData } = require('../../utils/mock-data.js')
const trace = require('../../utils/trace.js')
// W3 堆叠柱状图已改为 CSS 实现，无需 charts.js

Page({
  data: {
    isConfirmed: false,
    confirmText: '我已核对政策引导信息，数据无误',
    policyLevels: [],
    // 堆叠图数据：四级政策数量
    stackedData: [
      { name: '国家级', value: 0, color: '#E53935' },
      { name: '省级',   value: 0, color: '#F5A623' },
      { name: '市级',   value: 0, color: '#1A6DFF' },
      { name: '区级',   value: 0, color: '#00B365' }
    ]
  },

  onLoad() {
    const w3 = mockData.w4_policy
    // 按级别分组，并给每个政策添加 globalIdx 和 expanded 属性
    const levels = ['国家级', '省级', '市级', '区级']
    let globalIdx = 0
    const policyLevels = levels.map(level => ({
      level,
      policies: w3.policies.filter(p => p.level === level).map(p => ({
        ...p,
        expanded: false,
        globalIdx: globalIdx++
      }))
    }))
    // 统计各级政策数量 + 计算条形宽度（相对于最大值，留30%富余）
    const counts = levels.map(level => w3.policies.filter(p => p.level === level).length)
    const maxCount = Math.max(...counts, 1) * 1.4
    const stackedData = levels.map((level, i) => ({
      name: level,
      value: counts[i],
      barWidth: Math.min(85, Math.max(20, Math.round(counts[i] / maxCount * 100))),
      color: ['#E53935', '#F5A623', '#1A6DFF', '#00B365'][i]
    }))
    this.setData({ policyLevels, stackedData })
  },

  onReady() {
    // CSS 堆叠柱状图无需 Canvas 绘制
  },

  onTapLevel(e) {
    const level = e.currentTarget.dataset.level
    wx.showToast({ title: level + '政策详情', icon: 'none' })
  },

  // 折叠/展开政策卡片
  onTogglePolicy(e) {
    const idx = e.currentTarget.dataset.idx
    const policyLevels = this.data.policyLevels
    const policy = policyLevels.flatMap(l => l.policies)[idx]
    if (policy) {
      policy.expanded = !policy.expanded
      this.setData({
        policyLevels: JSON.parse(JSON.stringify(policyLevels))
      })
    }
  },

  // 编辑政策
  onEditPolicy(e) {
    const idx = e.currentTarget.dataset.idx
    const policy = this.data.policyLevels.flatMap(l => l.policies)[idx]
    if (!policy) return

    wx.showModal({
      title: '修正政策信息',
      editable: true,
      placeholderText: policy.clause,
      success: (res) => {
        if (res.confirm && res.content) {
          const policyLevels = this.data.policyLevels
          // 找到对应政策并更新
          let found = false
          for (const level of policyLevels) {
            for (const p of level.policies) {
              if (p.name === policy.name && p.level === policy.level) {
                p.clause = res.content
                p.manualNote = '人工修正：' + res.content.slice(0, 20) + (res.content.length > 20 ? '...' : '')
                found = true
                break
              }
            }
            if (found) break
          }
          if (found) {
            // 强制深拷贝，确保视图层能感知嵌套对象变化
            this.setData({
              policyLevels: JSON.parse(JSON.stringify(policyLevels))
            })
            // 记录用户修正到trace（低风险：用try-catch包裹，即使失败也不影响编辑功能）
            try {
              trace.recordEdit('w3-policy', 'policies[' + idx + '].clause', policy.clause || '', res.content || '')
            } catch (e) {
              console.error('[Trace] recordEdit failed:', e)
            }
          }
        }
      }
    })
  },

  onToggleConfirm() {
    this.setData({ isConfirmed: !this.data.isConfirmed })
  },

  onNext() {
    if (!this.data.isConfirmed) {
      wx.showToast({ title: '请先确认政策信息', icon: 'none' })
      return
    }
    wx.navigateTo({
      url: '/pages/w4-market/index',
      fail: () => wx.redirectTo({ url: '/pages/w4-market/index' })
    })
  },

  onGoBack() {
    wx.navigateBack({ delta: 1 })
  }
})
