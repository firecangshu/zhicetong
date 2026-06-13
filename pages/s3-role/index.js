// pages/s3-role/index.js
// S2 身份选择页 - 暗色科技风

Page({
  data: {
    // 身份选择
    selectedRole: '',
    roles: [
      { key: 'investor', name: '投资方', desc: '文旅项目投资人、投资机构代表', icon: '💰' },
      { key: 'planner', name: '规划方', desc: '规划设计院、建筑设计团队', icon: '🏗️' },
      { key: 'promoter', name: '招商方', desc: '文旅招商部门、运营机构', icon: '🤝' },
      { key: 'other', name: '其他角色', desc: '政府人员、咨询顾问等', icon: '📋' }
    ]
  },

  onLoad() {
    // 检查是否已选择过身份
    this.checkSavedRole()
  },

  onShow() {
    // 页面显示时触发
  },

  // ========= 检查已保存的身份 =========
  checkSavedRole() {
    try {
      const loginInfo = wx.getStorageSync('loginInfo')
      if (loginInfo && loginInfo.role) {
        this.setData({
          selectedRole: loginInfo.role
        })
        console.log('[S2] 已保存的身份：', loginInfo.role)
      }
    } catch (e) {
      console.log('[S2] 检查已保存身份失败', e)
    }
  },

  // ========= 身份选择 =========
  onSelectRole(e) {
    const role = e.currentTarget.dataset.role
    this.setData({ selectedRole: role })
    console.log('[S2] 选择身份：', role)
  },

  // ========= 确认并继续 =========
  onConfirmAndNext() {
    if (!this.data.selectedRole) {
      wx.showToast({ title: '请先选择身份', icon: 'none' })
      return
    }

    // 保存身份到登录信息
    try {
      const loginInfo = wx.getStorageSync('loginInfo') || {}
      loginInfo.role = this.data.selectedRole
      wx.setStorageSync('loginInfo', loginInfo)

      // 同时保存角色到数据库（如果用户已登录）
      if (loginInfo.userId) {
        wx.cloud.callFunction({
          name: 'updateUserRole',
          data: {
            userId: loginInfo.userId,
            role: this.data.selectedRole
          }
        }).then(() => {
          console.log('[S2] 用户角色已更新：', this.data.selectedRole)
        }).catch(err => {
          console.error('[S2] 更新用户角色失败', err)
        })
      }
    } catch (e) {
      console.log('[S2] 保存角色失败', e)
    }

    // 跳转到 S3 产品介绍
    wx.navigateTo({
      url: '/pages/s3-intro/index',
      fail: () => {
        wx.redirectTo({
          url: '/pages/s3-intro/index'
        })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '踏歌行智策通 - 身份选择',
      path: '/pages/s1-cover/index'
    };
  }
})
