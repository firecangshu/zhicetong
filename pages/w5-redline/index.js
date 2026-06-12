// pages/w6-redline/index.js
// W6 法规红线页面 V2.8 全量预埋版（含状态卡片）
const { mockData } = require('../../utils/mock-data.js')

Page({
  data: {
    threeLines: {},
    industryRegulations: [],
    isConfirmed: false,
    confirmText: '我已核对以上法规红线信息，确认无误',
    // 三区三线状态卡片
    zoneStatusCards: [
      { zone: '生态保护区', line: '生态保护红线', status: '❌ 不可占', color: '#E53935', desc: '严禁任何形式的开发建设活动' },
      { zone: '农田保护区', line: '永久基本农田', status: '⚠️ 严控占', color: '#F5A623', desc: '确需占用须省级审批，补划同等面积' },
      { zone: '城镇开发边界', line: '城镇开发边界', status: '✅ 可建设', color: '#00B365', desc: '合规前提下可正常开展文旅建设' }
    ]
  },

  onLoad() {
    const w6 = mockData.w6_redline
    // 将 threeLines 对象转换为 wxml 需要的数组格式
    const lines = w6.threeLines || {}
    const threeLinesList = [
      { key: 'ecoRedLine', label: '生态保护红线', ...lines.ecoRedLine },
      { key: 'farmland', label: '永久基本农田', ...lines.farmland },
      { key: 'urbanBoundary', label: '城镇开发边界', ...lines.urbanBoundary }
    ].filter(item => item.value)
    this.setData({
      threeLines: lines,
      threeLinesList: threeLinesList,
      industryRegulations: w6.industryRegulations || []
    })
  },

  // 编辑三区三线条目
  onEditLine(e) {
    const key = e.currentTarget.dataset.key
    const item = this.data.threeLines[key]
    if (!item) return
    wx.showModal({
      title: '修正数据或添加备注',
      editable: true,
      placeholderText: item.value,
      success: (res) => {
        if (res.confirm && res.content) {
          const lines = { ...this.data.threeLines }
          lines[key] = {
            ...lines[key],
            value: res.content,
            manualNote: '人工修正：' + res.content
          }
          // 同步更新 threeLinesList 数组
          const labelMap = { ecoRedLine: '生态保护红线', farmland: '永久基本农田', urbanBoundary: '城镇开发边界' }
          const threeLinesList = [
            { key: 'ecoRedLine', label: labelMap.ecoRedLine, ...lines.ecoRedLine },
            { key: 'farmland', label: labelMap.farmland, ...lines.farmland },
            { key: 'urbanBoundary', label: labelMap.urbanBoundary, ...lines.urbanBoundary }
          ].filter(item => item.value)
          this.setData({ threeLines: lines, threeLinesList: threeLinesList })
        }
      }
    })
  },

  // 编辑行业法规条目
  onEditReg(e) {
    const idx = e.currentTarget.dataset.index
    const item = this.data.industryRegulations[idx]
    if (!item) return
    wx.showModal({
      title: '修正法规要求或添加备注',
      editable: true,
      placeholderText: item.requirement,
      success: (res) => {
        if (res.confirm && res.content) {
          const list = [...this.data.industryRegulations]
          list[idx] = {
            ...list[idx],
            requirement: res.content,
            manualNote: '人工修正：' + res.content
          }
          this.setData({ industryRegulations: list })
        }
      }
    })
  },

  onToggleConfirm() {
    this.setData({ isConfirmed: !this.data.isConfirmed })
  },

  onNext() {
    if (!this.data.isConfirmed) {
      wx.showToast({ title: '请先确认法规红线', icon: 'none' })
      return
    }
    wx.navigateTo({
      url: '/pages/w6-swot/index',
      fail: () => wx.redirectTo({ url: '/pages/w6-swot/index' })
    })
  },

  onGoBack() {
    wx.navigateBack({ delta: 1 })
  }
})
