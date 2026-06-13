// pages/s1-cover/index.js
// CSS粒子流动背景 - APK兼容版

Page({
  data: {
    statusBarHeight: 44,   // 默认值
    safeAreaBottom: 34,     // 默认值
    particles: []            // CSS粒子数据
  },

  onLoad() {
    this.getSystemInfo();
    this.generateParticles();
  },

  // 获取系统信息（安全区适配）
  getSystemInfo() {
    try {
      const sysInfo = wx.getSystemInfoSync();
      const statusBarHeight = sysInfo.statusBarHeight || 44;
      const safeArea = sysInfo.safeArea;
      let safeAreaBottom = 34;
      if (safeArea) {
        safeAreaBottom = sysInfo.screenHeight - safeArea.bottom;
      }
      this.setData({
        statusBarHeight: statusBarHeight,
        safeAreaBottom: safeAreaBottom
      });
    } catch (e) {
      console.log('[S1] 获取系统信息失败', e);
    }
  },

  // 生成CSS粒子数据（替代Canvas）
  generateParticles() {
    // 根据设备性能动态调整粒子数量（低端设备自动降级）
    let PARTICLE_COUNT = 60;  // 默认值
    try {
      const sysInfo = wx.getSystemInfoSync();
      const benchmarkLevel = sysInfo.benchmarkLevel;  // Android 性能等级
      if (benchmarkLevel && benchmarkLevel < 5) {
        PARTICLE_COUNT = 30;  // 低端设备：减少粒子
        console.log('[S1] 低端设备检测，粒子数降级为：', PARTICLE_COUNT);
      } else if (benchmarkLevel && benchmarkLevel >= 10) {
        PARTICLE_COUNT = 80;  // 高端设备：增加粒子
        console.log('[S1] 高端设备检测，粒子数提升为：', PARTICLE_COUNT);
      }
    } catch (e) {
      console.log('[S1] 设备性能检测失败，使用默认粒子数');
    }

    let particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        id: i,
        left: Math.random() * 110 - 10,   // -10% 到 100%，让粒子从左侧外进入
        top: Math.random() * 110 - 5,      // -5% 到 105%，覆盖全屏
        size: Math.random() * 5 + 1,       // 1-6px，大小不一更自然
        delay: Math.random() * 10,          // 0-10s 随机延迟，错开动画
        duration: 1 + Math.random() * 1     // 1-2s，速度再加快一倍
      });
    }

    this.setData({ particles });
    console.log('[S1] CSS粒子已生成，数量：', PARTICLE_COUNT);
  },

  // 跳转进入小程序
  onEnterTap() {
    wx.navigateTo({
      url: '/pages/s2-identity/index'
    });
  },

  // 页面显示时重建粒子（从后台切回时恢复动画）
  onShow() {
    if (!this.data.particles || this.data.particles.length === 0) {
      this.generateParticles();
    }
  },

  // 页面隐藏时销毁粒子（切到后台/其他页面时释放内存）
  onHide() {
    this.setData({ particles: [] });
    console.log('[S1] 粒子已销毁（页面隐藏）');
  },

  // 页面卸载时销毁粒子（防止内存泄漏）
  onUnload() {
    this.setData({ particles: [] });
    console.log('[S1] 粒子已销毁（页面卸载）');
  }
});
