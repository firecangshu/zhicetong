// pages/w7-swot/index.js
const { mockData } = require('../../utils/mock-data.js')

Page({
  data: {
    S: [],
    W: [],
    O: [],
    T: [],
    showS: false,
    showW: false,
    showO: false,
    showT: false,
    isConfirmed: false,
    confirmText: '我已核对以上 SWOT 分析，确认无误'
  },

  onLoad() {
    const w7 = mockData.w7_swot
    this.setData({
      S: w7.S || [],
      W: w7.W || [],
      O: w7.O || [],
      T: w7.T || []
    })
  },

  // 展开/收起 S
  toggleS() {
    this.setData({ showS: !this.data.showS })
  },
  // 展开/收起 W
  toggleW() {
    this.setData({ showW: !this.data.showW })
  },
  // 展开/收起 O
  toggleO() {
    this.setData({ showO: !this.data.showO })
  },
  // 展开/收起 T
  toggleT() {
    this.setData({ showT: !this.data.showT })
  },

  // 编辑条目
  editItem(e) {
    const { key, index } = e.currentTarget.dataset
    const arr = this.data[key]
    const item = arr[index]
    if (!item) return
    wx.showModal({
      title: '编辑 ' + key + ' 条目',
      editable: true,
      placeholderText: item.point,
      success: (res) => {
        if (res.confirm && res.content) {
          const newArr = [...this.data[key]]
          newArr[index] = {
            ...newArr[index],
            point: res.content,
            manualNote: '人工修正：' + res.content,
            sourceType: 'manual',
            sourceName: '人工编辑'
          }
          this.setData({ [key]: newArr })
        }
      }
    })
  },

  // 新增条目
  addItem(e) {
    const { key } = e.currentTarget.dataset
    wx.showModal({
      title: '新增 ' + key + ' 条目',
      editable: true,
      placeholderText: '请输入内容',
      success: (res) => {
        if (res.confirm && res.content) {
          const newArr = [...this.data[key]]
          newArr.push({
            id: key + '_' + Date.now(),
            point: res.content,
            sourceType: 'manual',
            sourceName: '人工新增',
            manualNote: ''
          })
          this.setData({ [key]: newArr })
        }
      }
    })
  },

  // 确认勾选
  onConfirmChange(e) {
    this.setData({ isConfirmed: e.detail.value.length > 0 })
  },

  // 上一步
  onGoBack() {
    wx.navigateBack({ delta: 1 })
  },

  // 下一步
  onNext() {
    if (!this.data.isConfirmed) {
      wx.showToast({ title: '请先确认 SWOT 分析', icon: 'none' })
      return
    }
    wx.navigateTo({
      url: '/pages/w7-demand/index',
      fail: () => wx.redirectTo({ url: '/pages/w7-demand/index' })
    })
  }
})
