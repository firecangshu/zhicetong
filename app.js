// app.js
// TODO: 预留官方API接口，未来替换此处即可接入真实数据
App({
  onLaunch() {
    // 初始化全局状态
    this.globalData = {
      // 当前步骤索引（用于步骤条）
      currentStep: 0,
      // 所有步骤的确认状态
      stepConfirmed: {},
      // 地块信息（W1 框选结果，后续页面共享）
      landInfo: null,
      // 地块坐标（W1 锚点，后续页面共享）
      landCoord: null,
      // 决策引擎结果缓存
      engineResult: null
    };
  },

  // 通用工具：检查某步骤是否已确认
  isStepConfirmed(stepKey) {
    return this.globalData.stepConfirmed[stepKey] === true;
  },

  // 通用工具：标记某步骤已确认
  markStepConfirmed(stepKey) {
    this.globalData.stepConfirmed[stepKey] = true;
  }
});
