/**
 * 踏歌行智策通 —— 配置文件
 * 
 * 说明：
 * - 本文件用于集中管理第三方API密钥和配置
 * - 当前为预留模板，真实API接入时需填入实际密钥
 * - 请在 .gitignore 中排除本文件的真实密钥版本
 */

// 腾讯位置服务 API 配置
// 文档：https://lbs.qq.com/service/webService/webServiceGuide/webServiceOverview
const MAP_CONFIG = {
  // 在 https://lbs.qq.com/ 注册并获取 Key
  API_KEY: 'YOUR_TENCENT_MAP_KEY_HERE',
  
  // 接口地址
  GEOCODER_URL: 'https://apis.map.qq.com/ws/geocoder/v1/',
  PLACE_SEARCH_URL: 'https://apis.map.qq.com/ws/place/v1/search',
  DISTANCE_URL: 'https://apis.map.qq.com/ws/distance/v1/',
  
  // 超时设置（ms）
  TIMEOUT: 10000
}

// 腾讯混元大模型 API 配置
// 文档：https://cloud.tencent.com/document/product/1729
const LLM_CONFIG = {
  // 在腾讯云控制台获取 SecretId 和 SecretKey
  SECRET_ID: 'YOUR_SECRET_ID_HERE',
  SECRET_KEY: 'YOUR_SECRET_KEY_HERE',
  
  // 云函数地址（需提前部署）
  CLOUD_FUNCTION_URL: 'YOUR_CLOUD_FUNCTION_URL_HERE',
  
  // 模型选择
  MODEL: 'hunyuan-lite',  // hunyuan-lite / hunyuan-standard / hunyuan-pro
  
  // 超时设置（ms）
  TIMEOUT: 30000
}

// 微信云开发配置（预留）
const CLOUD_CONFIG = {
  ENV: 'your-cloud-env-id',  // 云开发环境ID
  REGION: 'ap-shanghai'        // 区域
}

module.exports = {
  MAP_CONFIG,
  LLM_CONFIG,
  CLOUD_CONFIG
}
