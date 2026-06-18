// pages/w8-position/index.js
const { mockData } = require('../../utils/mock-data.js')

Page({
  data: {
    dataSummary: {},
    naming: { projectName: { value: '', logic: '' }, slogan: { value: '', logic: '' } },
    recommendations: [],
    isConfirmed: false,
    confirmText: '我已核对以上战略定位建议，确认无误',
    filterData: [],
    conversionRates: [],
    resultData: {}
  },

  onLoad() {
    try {
      const w9 = mockData.w9_position || {}
      const naming = w9.naming || {}
      const rawName = (naming.projectName || {}).value || '定远森系研学营地'
      const cleanName = rawName.replace(/^踏歌行[·•]?\s*/, '')

      const rawFunnel = w9.funnel || [
        { name: '初始地块筛选', value: 100 },
        { name: '合规性过滤', value: 72 },
        { name: '空间适配筛选', value: 53 },
        { name: '经济可行性过滤', value: 38 },
        { name: '市场需求匹配', value: 25 },
        { name: '最终推荐方案', value: 18, label: cleanName }
      ]

      const filterColors = ['#1A6DFF','#00B365','#F5A623','#8C6BFF','#E53935']
      const filterBgColors = ['#E3F2FD','#E8F5E9','#FFF3E0','#F3E5F5','#FFEBEE']

      const filterData = rawFunnel.slice(0, 5).map((item, i) => ({
        name: item.name,
        value: item.value,
        color: filterColors[i],
        bgColor: filterBgColors[i],
        rate: item.value + '%',
        widthRate: item.value
      }))

      const conversionRates = []
      for (let i = 0; i < 5; i++) {
        const curr = rawFunnel[i].value
        const next = rawFunnel[i + 1].value
        const drop = curr > 0 ? Math.round((curr - next) / curr * 100) : 0
        conversionRates.push({
          from: rawFunnel[i].name,
          to: rawFunnel[i + 1].name,
          dropRate: drop
        })
      }

      const resultItem = rawFunnel[5] || { name: '最终推荐方案', value: 18, label: cleanName }

      this.setData({
        dataSummary: w9.dataSummary || {},
        naming: {
          projectName: { value: cleanName, logic: (naming.projectName || {}).logic || '' },
          slogan: (naming.slogan || { value: '', logic: '' })
        },
        recommendations: w9.recommendations || [],
        filterData,
        conversionRates,
        resultData: {
          name: resultItem.name,
          value: resultItem.value,
          label: resultItem.label || cleanName,
          rate: resultItem.value + '%'
        }
      })
    } catch (e) {
      console.error('[W9 onLoad] 错误:', e)
    }
  },

  onEditNaming() {
    wx.showActionSheet({
      itemList: ['修改项目名称', '修改Slogan'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.showModal({
            title: '修改项目名称',
            editable: true,
            placeholderText: this.data.naming.projectName.value,
            success: (res2) => {
              if (res2.confirm && res2.content) {
                this.setData({ 'naming.projectName.value': res2.content })
              }
            }
          })
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '修改Slogan',
            editable: true,
            placeholderText: this.data.naming.slogan.value,
            success: (res2) => {
              if (res2.confirm && res2.content) {
                this.setData({ 'naming.slogan.value': res2.content })
              }
            }
          })
        }
      }
    })
  },

  onToggleConfirm() {
    this.setData({ isConfirmed: !this.data.isConfirmed })
  },

  onNext() {
    if (!this.data.isConfirmed) {
      wx.showToast({ title: '请先确认战略定位', icon: 'none' })
      return
    }
    // 用 navigateTo 保留 W8 在栈中，W9 可正常 navigateBack
    wx.navigateTo({
      url: '/pages/w9-result/index',
      fail: () => {
        // 页面栈满时降级为 redirectTo（W9 返回时需用 redirectTo 跳回 W8）
        wx.redirectTo({ url: '/pages/w9-result/index' })
      }
    })
  },

  onGoBack() {
    wx.navigateBack({ delta: 1 })
  }
})
