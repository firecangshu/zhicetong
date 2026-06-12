// pages/s2-identity/index.js
Page({
  data: {
    selectedRole: '',
    roles: [
      { key: 'investor', name: '投资方', desc: '文旅项目投资人、投资机构代表', icon: '💰' },
      { key: 'planner', name: '规划方', desc: '规划设计院、建筑设计团队', icon: '🏗️' },
      { key: 'promoter', name: '招商方', desc: '文旅招商部门、运营机构', icon: '🤝' },
      { key: 'other', name: '其他角色', desc: '政府人员、咨询顾问、其他', icon: '📋' }
    ]
  },

  onLoad() {
    // 读取之前保存的身份
    const saved = wx.getStorageSync('userRole')
    if (saved) {
      this.setData({ selectedRole: saved })
    }
  },

  // 选择身份
  onSelectRole(e) {
    const role = e.currentTarget.dataset.role
    this.setData({ selectedRole: role })
  },

  // 确认并继续
  onConfirmAndNext() {
    if (!this.data.selectedRole) {
      wx.showToast({ title: '请先选择身份', icon: 'none' })
      return
    }
    // 用 navigateTo 保留页面栈，确保系统返回可逐页后退
    wx.navigateTo({
      url: '/pages/s3-intro/index',
      fail: () => { wx.redirectTo({ url: '/pages/s3-intro/index' }) }
    })
  },

  // 返回封面（S1 是启动页，无需后退）
  onGoBack() {
    wx.navigateBack({ delta: 1 })
  }
})
