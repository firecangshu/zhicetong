// pages/s2-identity/index.js
// S1 登录页 - 只保留登录功能，成功后跳S2身份选择

Page({
  data: {
    // 开发模式标志
    isDevMode: false,

    // 登录方式展开控制
    showPhoneLogin: false,
    showUsernameLogin: false,
    showRegister: false,

    // 微信登录
    wechatUserInfo: null,

    // 手机号登录
    phoneNumber: '',
    smsCode: '',
    smsCountdown: 0,
    smsTimer: null,

    // 用户名密码登录
    username: '',
    password: '',

    // 注册
    regUsername: '',
    regPassword: '',
    regPhone: '',
    regEmail: ''
  },

  onLoad() {
    // 检测开发模式
    this.checkDevMode()
  },

  onUnload() {
    // 清除倒计时定时器
    if (this.data.smsTimer) {
      clearInterval(this.data.smsTimer)
      this.setData({ smsTimer: null })
    }
  },

  // ========= 开发模式检测 =========
  checkDevMode() {
    try {
      const accountInfo = wx.getAccountInfoSync()
      const isDev = accountInfo.miniProgram.envVersion === 'develop'
      this.setData({ isDevMode: isDev })
      if (isDev) {
        console.log('[S1] 开发模式已启用，将显示跳过登录按钮')
      }
    } catch (e) {
      console.log('[S1] 检测开发模式失败', e)
    }
  },

  // ========= 1. 微信一键登录 =========
  onWechatLogin(e) {
    if (!e.detail.code) {
      wx.showToast({ title: '微信登录失败，请重试', icon: 'none' })
      return
    }

    wx.showLoading({ title: '登录中...' })

    // 调用云函数登录
    wx.cloud.callFunction({
      name: 'login',
      data: {
        code: e.detail.code
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result && res.result.success) {
        const loginInfo = res.result.data
        // 保存登录态
        wx.setStorageSync('loginInfo', loginInfo)
        
        wx.showToast({ title: '登录成功', icon: 'success' })
        console.log('[S1] 微信登录成功', loginInfo)
        
        // ✅ 跳转到S2身份选择页
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/s3-role/index',
            fail: () => {
              wx.redirectTo({
                url: '/pages/s3-role/index'
              })
            }
          })
        }, 1500)
      } else {
        wx.showToast({ title: res.result.message || '登录失败', icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('[S1] 微信登录失败', err)
      // 开发模式下模拟登录成功
      if (this.data.isDevMode) {
        const mockLoginInfo = {
          userId: 'dev_user_' + Date.now(),
          loginType: 'wechat',
          role: '',
          createTime: new Date().toISOString()
        }
        wx.setStorageSync('loginInfo', mockLoginInfo)
        wx.showToast({ title: '开发模式：模拟登录成功', icon: 'none' })
        console.log('[S1] 开发模式：模拟微信登录成功', mockLoginInfo)
        
        // ✅ 跳转到S2身份选择页
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/s3-role/index',
            fail: () => {
              wx.redirectTo({
                url: '/pages/s3-role/index'
              })
            }
          })
        }, 1500)
      } else {
        wx.showToast({ title: '登录失败，请稍后重试', icon: 'none' })
      }
    })
  },

  // ========= 2. 手机号 + 验证码登录 =========
  onPhoneInput(e) {
    this.setData({ phoneNumber: e.detail.value })
  },

  onSmsCodeInput(e) {
    this.setData({ smsCode: e.detail.value })
  },

  onSendSmsCode() {
    if (this.data.smsCountdown > 0) return

    const phone = this.data.phoneNumber
    if (!phone || phone.length !== 11) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    wx.showLoading({ title: '发送中...' })

    // 调用云函数发送验证码
    wx.cloud.callFunction({
      name: 'sendSmsCode',
      data: { phone: phone }
    }).then(res => {
      wx.hideLoading()
      if (res.result && res.result.success) {
        wx.showToast({ title: '验证码已发送', icon: 'success' })
        // 开始倒计时
        this.startSmsCountdown()
      } else {
        wx.showToast({ title: res.result.message || '发送失败', icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('[S1] 发送验证码失败', err)
      // 开发模式下模拟发送成功
      if (this.data.isDevMode) {
        wx.showToast({ title: '开发模式：验证码已发送（模拟）', icon: 'none' })
        this.startSmsCountdown()
      } else {
        wx.showToast({ title: '发送失败，请稍后重试', icon: 'none' })
      }
    })
  },

  startSmsCountdown() {
    this.setData({ smsCountdown: 60 })
    const timer = setInterval(() => {
      const count = this.data.smsCountdown - 1
      if (count <= 0) {
        clearInterval(timer)
        this.setData({ smsCountdown: 0, smsTimer: null })
      } else {
        this.setData({ smsCountdown: count })
      }
    }, 1000)
    this.setData({ smsTimer: timer })
  },

  onPhoneLogin() {
    const phone = this.data.phoneNumber
    const code = this.data.smsCode

    if (!phone || phone.length !== 11) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!code || code.length < 4) {
      wx.showToast({ title: '请输入正确的验证码', icon: 'none' })
      return
    }

    wx.showLoading({ title: '登录中...' })

    // 调用云函数验证并登录
    wx.cloud.callFunction({
      name: 'verifySmsCode',
      data: { phone: phone, code: code }
    }).then(res => {
      wx.hideLoading()
      if (res.result && res.result.success) {
        const loginInfo = res.result.data
        wx.setStorageSync('loginInfo', loginInfo)
        
        wx.showToast({ title: '登录成功', icon: 'success' })
        console.log('[S1] 手机登录成功', loginInfo)
        
        // ✅ 跳转到S2身份选择页
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/s3-role/index',
            fail: () => {
              wx.redirectTo({
                url: '/pages/s3-role/index'
              })
            }
          })
        }, 1500)
      } else {
        wx.showToast({ title: res.result.message || '登录失败', icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('[S1] 手机登录失败', err)
      // 开发模式下模拟登录成功
      if (this.data.isDevMode) {
        const mockLoginInfo = {
          userId: 'dev_user_phone_' + Date.now(),
          loginType: 'phone',
          phone: phone,
          role: '',
          createTime: new Date().toISOString()
        }
        wx.setStorageSync('loginInfo', mockLoginInfo)
        wx.showToast({ title: '开发模式：模拟登录成功', icon: 'none' })
        console.log('[S1] 开发模式：模拟手机登录成功', mockLoginInfo)
        
        // ✅ 跳转到S2身份选择页
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/s3-role/index',
            fail: () => {
              wx.redirectTo({
                url: '/pages/s3-role/index'
              })
            }
          })
        }, 1500)
      } else {
        wx.showToast({ title: '登录失败，请稍后重试', icon: 'none' })
      }
    })
  },

  // ========= 3. 用户名 + 密码登录 =========
  onUsernameInput(e) {
    this.setData({ username: e.detail.value })
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },

  onUsernameLogin() {
    const username = this.data.username
    const password = this.data.password

    if (!username) {
      wx.showToast({ title: '请输入用户名', icon: 'none' })
      return
    }
    if (!password) {
      wx.showToast({ title: '请输入密码', icon: 'none' })
      return
    }

    wx.showLoading({ title: '登录中...' })

    // 调用云函数验证并登录
    wx.cloud.callFunction({
      name: 'loginWithPassword',
      data: { username: username, password: password }
    }).then(res => {
      wx.hideLoading()
      if (res.result && res.result.success) {
        const loginInfo = res.result.data
        wx.setStorageSync('loginInfo', loginInfo)
        
        wx.showToast({ title: '登录成功', icon: 'success' })
        console.log('[S1] 用户名密码登录成功', loginInfo)
        
        // ✅ 跳转到S2身份选择页
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/s3-role/index',
            fail: () => {
              wx.redirectTo({
                url: '/pages/s3-role/index'
              })
            }
          })
        }, 1500)
      } else {
        wx.showToast({ title: res.result.message || '登录失败', icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('[S1] 用户名密码登录失败', err)
      wx.showToast({ title: '登录失败，请检查用户名密码', icon: 'none' })
    })
  },

  // ========= 注册 =========
  onRegUsernameInput(e) {
    this.setData({ regUsername: e.detail.value })
  },

  onRegPasswordInput(e) {
    this.setData({ regPassword: e.detail.value })
  },

  onRegPhoneInput(e) {
    this.setData({ regPhone: e.detail.value })
  },

  onRegEmailInput(e) {
    this.setData({ regEmail: e.detail.value })
  },

  onRegister() {
    const { regUsername, regPassword, regPhone, regEmail } = this.data

    if (!regUsername) {
      wx.showToast({ title: '请输入用户名', icon: 'none' })
      return
    }
    if (!regPassword || regPassword.length < 6) {
      wx.showToast({ title: '密码至少6位', icon: 'none' })
      return
    }
    if (!regPhone || regPhone.length !== 11) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!regEmail || !regEmail.includes('@')) {
      wx.showToast({ title: '请输入正确的邮箱', icon: 'none' })
      return
    }

    wx.showLoading({ title: '注册中...' })

    // 调用云函数注册
    wx.cloud.callFunction({
      name: 'registerUser',
      data: {
        username: regUsername,
        password: regPassword,
        phone: regPhone,
        email: regEmail
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result && res.result.success) {
        wx.showToast({ title: '注册成功，请登录', icon: 'success' })
        // 清空注册表单，切换到登录
        this.setData({
          showRegister: false,
          regUsername: '',
          regPassword: '',
          regPhone: '',
          regEmail: '',
          username: regUsername,
          password: ''
        })
      } else {
        wx.showToast({ title: res.result.message || '注册失败', icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('[S1] 注册失败', err)
      wx.showToast({ title: '注册失败，请稍后重试', icon: 'none' })
    })
  },

  // ========= 展开/收起控制 =========
  togglePhoneLogin() {
    this.setData({
      showPhoneLogin: !this.data.showPhoneLogin,
      showUsernameLogin: false,
      showRegister: false
    })
  },

  toggleUsernameLogin() {
    this.setData({
      showUsernameLogin: !this.data.showUsernameLogin,
      showPhoneLogin: false,
      showRegister: false
    })
  },

  toggleRegister() {
    this.setData({
      showRegister: !this.data.showRegister,
      showUsernameLogin: false,
      showPhoneLogin: false
    })
  },

  // ========= 开发模式：跳过登录 =========
  onSkipLogin() {
    if (!this.data.isDevMode) return
    console.log('[S1] 开发模式：跳过登录')
    
    // 模拟登录态
    const mockLoginInfo = {
      userId: 'dev_user_skip_' + Date.now(),
      loginType: 'dev_skip',
      role: '',
      createTime: new Date().toISOString()
    }
    wx.setStorageSync('loginInfo', mockLoginInfo)
    
    wx.showToast({
      title: '已跳过登录',
      icon: 'none'
    })
    
    // ✅ 跳转到S2身份选择页
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/s3-role/index',
        fail: () => {
          wx.redirectTo({
            url: '/pages/s3-role/index'
          })
        }
      })
    }, 1000)
  }
})
