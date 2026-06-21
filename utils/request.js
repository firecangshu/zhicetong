/**
 * utils/request.js
 * 踏歌行智策通 —— 统一网络请求封装
 * V1.0
 * 
 * 功能：超时控制 + 自动重试 + 错误降级 + 统一日志
 * 用法：const { request } = require('../../utils/request.js')
 *       request(url, { method, data, header, timeout, retries })
 */

const DEFAULT_TIMEOUT = 8000;   // 默认8秒超时
const DEFAULT_RETRIES = 2;      // 默认重试2次

function request(url, options = {}) {
  const {
    method = 'GET',
    data = {},
    header = {},
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    fallbackData = null          // 降级数据：请求失败时返回
  } = options;

  return new Promise((resolve, reject) => {
    let attemptCount = 0;

    function doRequest() {
      attemptCount++;
      let timer = null;
      let requestTask = null;
      let isResolved = false;

      function cleanup() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }

      requestTask = wx.request({
        url: url,
        method: method,
        data: data,
        header: Object.assign({
          'Content-Type': 'application/json'
        }, header),
        success: (res) => {
          if (isResolved) return;
          cleanup();
          isResolved = true;

          // HTTP 状态码判断
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            console.warn('[Request] 401 Unauthorized:', url);
            reject({ type: 'auth', message: '登录已过期，请重新登录', statusCode: 401 });
          } else if (res.statusCode >= 500) {
            console.warn('[Request] Server Error', res.statusCode, url);
            retryOrFail('服务器繁忙，请稍后重试');
          } else {
            console.warn('[Request] HTTP Error', res.statusCode, url);
            reject({ type: 'http', message: '请求失败(' + res.statusCode + ')', statusCode: res.statusCode });
          }
        },
        fail: (err) => {
          if (isResolved) return;
          cleanup();
          isResolved = true;

          console.warn('[Request] Network Fail (attempt ' + attemptCount + '/' + (retries + 1) + '):', err.errMsg || err);

          // 区分错误类型
          const errMsg = err.errMsg || '';
          if (errMsg.indexOf('timeout') !== -1 || errMsg.indexOf('超时') !== -1) {
            retryOrFail('请求超时，正在重试...');
          } else if (errMsg.indexOf('fail') !== -1 || errMsg.indexOf('断网') !== -1) {
            retryOrFail('网络连接失败，正在重试...');
          } else {
            retryOrFail('网络异常，正在重试...');
          }
        }
      });

      // 自定义超时计时器（比微信内置超时更可控）
      timer = setTimeout(() => {
        if (isResolved) return;
        try {
          requestTask && requestTask.abort && requestTask.abort();
        } catch (e) {}
        cleanup();
        isResolved = true;
        console.warn('[Request] Custom timeout (', timeout, 'ms):', url);
        retryOrFail('请求超时，正在重试...');
      }, timeout);

      function retryOrFail(reason) {
        if (attemptCount <= retries) {
          console.log('[Request] Retrying (' + attemptCount + '/' + retries + ')...');
          // 指数退避：每次重试延迟增加
          const delay = Math.min(1000 * Math.pow(2, attemptCount - 1), 5000);
          setTimeout(doRequest, delay);
        } else {
          // 所有重试用完，尝试降级
          if (fallbackData !== null) {
            console.log('[Request] All retries failed, using fallback data for:', url);
            resolve(fallbackData);
          } else {
            reject({ type: 'network', message: '网络请求失败，请检查网络后重试', raw: reason });
          }
        }
      }
    }

    doRequest();
  });
}

/**
 * 快捷方法：GET
 */
function get(url, options = {}) {
  return request(url, Object.assign({}, options, { method: 'GET' }));
}

/**
 * 快捷方法：POST
 */
function post(url, data, options = {}) {
  return request(url, Object.assign({}, options, { method: 'POST', data: data }));
}

module.exports = {
  request: request,
  get: get,
  post: post
};
