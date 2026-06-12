// pages/w8-demand/index.js
// W8 需求澄清页面 V2.8 全量版
const { mockData } = require('../../utils/mock-data.js')

Page({
  data: {
    clientDemands: [],
    confirmedAdvantages: [],
    budgetRange: '',
    budgetOtherValue: '',
    budgetRemark: '',
    advantageItems: [{}],  // 默认1条空
    isConfirmed: false,
    confirmText: '我已核对以上诉求与优势资源，确认无误'
  },

  onLoad() {
    const w8 = mockData.w8_demand
    this.setData({
      clientDemands: w8.clientDemands || [],
      confirmedAdvantages: w8.confirmedAdvantages || []
    })
  },

  // ========= 甲方诉求 Radio =========
  onRadioChange(e) {
    const key = e.currentTarget.dataset.key
    const value = e.currentTarget.dataset.value
    const list = this.data.clientDemands.map(item => {
      if (item.key === key) return { ...item, answer: value }
      return item
    })
    this.setData({ clientDemands: list })
  },

  // 添加备注
  onEditNote(e) {
    const key = e.currentTarget.dataset.key
    const item = this.data.clientDemands.find(i => i.key === key)
    if (!item) return

    wx.showModal({
      title: '添加/修改备注',
      editable: true,
      placeholderText: item.manualNote || '请输入备注内容',
      success: (res) => {
        if (res.confirm && res.content) {
          const newList = this.data.clientDemands.map(i => {
            if (i.key === key) return { ...i, manualNote: res.content }
            return i
          })
          this.setData({ clientDemands: newList })
        }
      }
    })
  },

  // ========= 优势资源 Checkbox =========
  onToggleAdvantage(e) {
    const key = e.currentTarget.dataset.key
    const list = this.data.confirmedAdvantages.map(item => {
      if (item.key === key) return { ...item, confirmed: !item.confirmed }
      return item
    })
    this.setData({ confirmedAdvantages: list })
  },

  // ========= 总投预算阶梯 =========
  onBudgetChange(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      budgetRange: value,
      budgetRemark: ''
    })
    if (value !== 'other') {
      this.setData({ budgetOtherValue: '' })
    }
  },

  onBudgetOtherTap() {
    this.setData({ budgetRange: 'other' })
  },

  onBudgetOtherInput(e) {
    this.setData({ budgetOtherValue: e.detail.value })
  },

  onBudgetRemarkInput(e) {
    this.setData({ budgetRemark: e.detail.value })
  },

  // ========= 其他优势条件补充 =========
  onAddAdvantage() {
    const list = this.data.advantageItems
    if (list.length >= 5) return
    list.push({})
    this.setData({ advantageItems: list })
  },

  onDeleteAdvantage(e) {
    const idx = e.currentTarget.dataset.idx
    const list = this.data.advantageItems
    if (list.length <= 1) return
    list.splice(idx, 1)
    this.setData({ advantageItems: list })
  },

  onAdvantageInput(e) {
    const idx = e.currentTarget.dataset.idx
    const key = `advantageItems[${idx}].content`
    this.setData({ [key]: e.detail.value })
  },

  onAdvantageRemarkInput(e) {
    const idx = e.currentTarget.dataset.idx
    const key = `advantageItems[${idx}].remark`
    this.setData({ [key]: e.detail.value })
  },

  // ========= 确认 =========
  onToggleConfirm() {
    this.setData({ isConfirmed: !this.data.isConfirmed })
  },

  onNext() {
    if (!this.data.isConfirmed) {
      wx.showToast({ title: '请先确认需求澄清', icon: 'none' })
      return
    }
    // 收集数据（可在此处写 mockData 或发送到后端）
    const result = {
      clientDemands: this.data.clientDemands,
      confirmedAdvantages: this.data.confirmedAdvantages,
      budget: {
        range: this.data.budgetRange,
        otherValue: this.data.budgetOtherValue,
        remark: this.data.budgetRemark
      },
      advantageItems: this.data.advantageItems.filter(i => i.content)
    }
    console.log('W8 提交数据：', result)
    wx.navigateTo({
      url: '/pages/w8-position/index',
      fail: () => wx.redirectTo({ url: '/pages/w8-position/index' })
    })
  },

  onGoBack() {
    wx.navigateBack({ delta: 1 })
  }
})
