// 云函数入口函数
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloudbase-d6g6gqtx69462308a'  // 用户提供的环境ID
})

exports.main = async (event, context) => {
  console.log('测试云函数被调用', event)
  
  return {
    code: 0,
    message: '云函数调用成功！',
    data: {
      env: cloud.DYNAMIC_CURRENT_ENV,
      timestamp: new Date().toISOString()
    }
  }
}
