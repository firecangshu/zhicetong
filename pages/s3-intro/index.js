// pages/s3-intro/index.js
Page({
  data: {},

  // 确认并继续
  onConfirmAndNext() {
    wx.navigateTo({
      url: '/pages/s4-guide/index',
      fail: () => { wx.redirectTo({ url: '/pages/s4-guide/index' }) }
    })
  },

  // 返回上一页
  onGoBack() {
    wx.navigateBack({ delta: 1 })
  }
})
