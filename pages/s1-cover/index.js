// pages/s1-cover/index.js
// 最终执行版 - 修复小程序兼容性问题

Page({
  data: {
    statusBarHeight: 44,   // 默认值
    safeAreaBottom: 34     // 默认值
  },

  onLoad() {
    this.getSystemInfo();
    this.initParticles();
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

  // 初始化粒子动画
  initParticles() {
    const query = this.createSelectorQuery();
    query.select('#particle-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0] || !res[0].node) {
          console.log('[S1] Canvas 节点未找到');
          return;
        }
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        // 设置画布尺寸（适配高清屏）
        const dpr = wx.getSystemInfoSync().pixelRatio || 2;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        const width = res[0].width;
        const height = res[0].height;

        // 粒子配置（左上 → 右下流动）
        let particles = [];
        const PARTICLE_COUNT = 800;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0.3 + Math.random() * 0.4,
            vy: 0.2 + Math.random() * 0.3,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.2,
            twinkle: Math.random() * Math.PI * 2
          });
        }

        // 用闭包变量保存 frameId，避免 this 丢失
        let frameId = null;

        // 动画循环
        const animate = () => {
          ctx.clearRect(0, 0, width, height);

          // 绘制粒子
          particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.twinkle += 0.02;

            // 边界循环
            if (p.x > width) p.x = 0;
            if (p.y > height) p.y = 0;

            // 闪烁效果
            const alpha = p.opacity * (0.8 + 0.2 * Math.sin(p.twinkle));

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.fill();
          });

          frameId = canvas.requestAnimationFrame(animate);
        };

        animate();

        // 保存 frameId 到 this，供 onUnload 销毁
        this._frameId = frameId;
        this._canvas = canvas;
      });
  },

  // 页面卸载时销毁动画（重要！防止 GPU 占用）
  onUnload() {
    if (this._canvas && this._frameId) {
      this._canvas.cancelAnimationFrame(this._frameId);
      this._frameId = null;
      this._canvas = null;
      console.log('[S1] 粒子动画已销毁');
    }
  },

  // 跳转进入小程序
  onEnterTap() {
    wx.navigateTo({
      url: '/pages/s2-identity/index'
    });
  }
});
