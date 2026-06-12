// pages/s1-cover/index.js
// V2.9 - 移除 Canvas 粒子动画，改用 CSS 装饰点（兼容 APK）

Page({
  data: {
    statusBarHeight: 44,   // default value
    safeAreaBottom: 34,     // default value (iPhone X series)
    decorDots: []           // CSS 装饰点数据
  },

  onLoad() {
    this.genDecorDots();
  },

  onReady() {
    // CSS 装饰点无需 Canvas 初始化
  },

  // 生成 CSS 装饰点（替代 Canvas 粒子）
  genDecorDots() {
    const dots = []
    for (let i = 0; i < 30; i++) {
      dots.push({
        idx: i,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        o: (Math.random() * 0.5 + 0.2).toFixed(2),
        s: Math.round(Math.random() * 4 + 2)
      })
    }
    this.setData({ decorDots: dots })
  },

  // Navigate to next page: S1 → S2 user identity
  onEnterTap() {
    wx.navigateTo({
      url: '/pages/s2-identity/index'
    });
  }
});
