// pages/s3-intro/index.js
// S3 产品介绍页 - 暗色科技风

Page({
  data: {
    // 页面数据
  },

  onLoad() {
    console.log('[S3] 产品介绍页加载');
  },

  onShow() {
    // 页面显示时触发
  },

  // 确认并继续 - 跳转到S4使用引导页
  onConfirmAndNext() {
    wx.redirectTo({
      url: '/pages/s4-guide/index',
      fail: () => {
        // 如果S4不存在，跳转到W1地块选择
        wx.redirectTo({
          url: '/pages/w1-land/index',
          fail: () => {
            wx.showToast({
              title: '页面开发中',
              icon: 'none'
            });
          }
        });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '踏歌行智策通 - 文旅项目战略定位辅助系统',
      path: '/pages/s1-cover/index'
    };
  }
});
