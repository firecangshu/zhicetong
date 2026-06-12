/**
 * utils/fetcher.js
 * V2.8 接口占位规范
 * TODO: 未来接入真实 API 时，只需修改此文件
 */

// 模拟延迟（模拟网络请求）
const mockDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 官方 API 数据获取（国土空间规划、地名地址、政策法规等）
 * @param {string} endpoint - API 端点标识
 * @param {object} params - 查询参数
 * @returns {Promise<null>} 暂时返回 null，使用预埋数据
 */
const official = async (endpoint, params = {}) => {
  console.log(`[API Call] Fetching ${endpoint} from Official DB...`, params);
  await mockDelay(200);
  return null; // 暂时返回空，使用预埋数据
};

/**
 * AI 聚合数据获取（OTA评论、社交媒体、竞品分析等）
 * @param {string} query - 查询关键词
 * @param {object} params - 附加参数
 * @returns {Promise<null>} 暂时返回 null，使用预埋数据
 */
const ai = async (query, params = {}) => {
  console.log(`[AI Call] Aggregating data for ${query}...`, params);
  await mockDelay(500);
  return null; // 暂时返回空，使用预埋数据
};

/**
 * 数据获取统一入口
 * 未来接入真实 API 时，只需修改此对象的实现
 */
const fetchSource = {
  official,
  ai
};

/**
 * 示例：未来接入真实 API 的写法
 * 
 * // 真实实现示例（未来启用）：
 * const official = async (endpoint, params = {}) => {
 *   const res = await wx.request({
 *     url: `https://api.tagexing.com/official/${endpoint}`,
 *     method: 'GET',
 *     data: params
 *   });
 *   return res.data;
 * };
 * 
 * const ai = async (query, params = {}) => {
 *   const res = await wx.request({
 *     url: 'https://api.tagexing.com/ai/aggregate',
 *     method: 'POST',
 *     data: { query, ...params }
 *   });
 *   return res.data;
 * };
 */

module.exports = {
  fetchSource
};
