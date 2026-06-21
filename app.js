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
      engineResult: null,
      // 全局错误日志（限制条数，防止内存溢出）
      errorLog: []
    };
    // 页面栈深度检测（防止栈溢出）
    this._checkPageStack();
  },

  // ====== 全局错误捕获 ======
  onError(msg) {
    console.error('[Global Error]', msg);
    this._logError('runtime', msg);
    // 上报到trace（如果可用）
    try {
      const trace = require('./utils/trace.js');
      if (trace && trace.record) {
        trace.record({ type: 'global_error', message: msg }, { verdict: 'ERROR', confidence: 0 });
      }
    } catch (e) {}
  },

  onUnhandledRejection(res) {
    console.error('[Global Rejection]', res && res.reason);
    this._logError('rejection', res && res.reason ? String(res.reason) : 'unknown');
  },

  // 内部：记录错误日志（最多保留20条，防止内存泄漏）
  _logError(type, message) {
    const log = this.globalData.errorLog;
    log.push({ type: type, message: String(message).slice(0, 200), time: Date.now() });
    if (log.length > 20) {
      log.shift();
    }
  },

  // 内部：检测页面栈深度，超过8层发出警告
  _checkPageStack() {
    setInterval(() => {
      try {
        const pages = getCurrentPages();
        if (pages && pages.length > 8) {
          console.warn('[App] 页面栈深度警告: ' + pages.length + '层，建议使用 redirectTo/reLaunch');
        }
      } catch (e) {}
    }, 3000);
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
