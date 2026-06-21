/**
 * utils/debounce.js
 * 踏歌行智策通 —— 防抖节流工具
 * V1.0
 * 
 * 防抖（debounce）：事件触发后等待N秒才执行，期间再次触发则重新计时
 * 节流（throttle）：事件触发后N秒内只执行一次
 */

/**
 * 防抖函数
 * @param {Function} fn - 要执行的函数
 * @param {Number} delay - 延迟毫秒数（默认300ms）
 * @param {Boolean} immediate - 是否立即执行首次（默认false）
 * @returns {Function} - 包装后的函数
 */
function debounce(fn, delay, immediate) {
  delay = delay || 300;
  immediate = immediate || false;
  var timer = null;
  return function () {
    var args = arguments;
    var self = this;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (immediate) {
      // 首次立即执行，后续防抖
      var callNow = !timer;
      timer = setTimeout(function () {
        timer = null;
      }, delay);
      if (callNow) fn.apply(self, args);
    } else {
      // 延迟执行
      timer = setTimeout(function () {
        fn.apply(self, args);
      }, delay);
    }
  };
}

/**
 * 节流函数
 * @param {Function} fn - 要执行的函数
 * @param {Number} interval - 间隔毫秒数（默认300ms）
 * @returns {Function} - 包装后的函数
 */
function throttle(fn, interval) {
  interval = interval || 300;
  var lastTime = 0;
  return function () {
    var now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, arguments);
    }
  };
}

module.exports = {
  debounce: debounce,
  throttle: throttle
};
