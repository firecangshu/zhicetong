// pages/s4-guide/index.js
// S4 使用指南页面
const { mockData } = require('../../utils/mock-data.js')

Page({
  data: {
    data: {},
    // 工作流程：W1~W9（与 pages 目录实际页码一致，身份认证不属于工作流）
    timelineSteps: [
      { step: 1, phase: 'W1 地块框选', tag: '地块', tagType: 'green', desc: '在虚拟地图上框选目标地块，输入坐标', pages: ['W1'] },
      { step: 2, phase: 'W2 资源调查', tag: '资源', tagType: 'green', desc: 'AI 评估地块周边旅游资源禀赋（地文/水域/生物/天象）', pages: ['W2'] },
      { step: 3, phase: 'W3 政策引导', tag: '政策', tagType: 'orange', desc: '四级政策库匹配，识别政策红利与合规要求', pages: ['W3'] },
      { step: 4, phase: 'W4 市场调研', tag: '市场', tagType: 'orange', desc: '商圈分析、客源市场、竞合分析，输出市场定位建议', pages: ['W4'] },
      { step: 5, phase: 'W5 法规红线', tag: '红线', tagType: 'red', desc: '三区三线检测，确保项目合规，规避法律风险', pages: ['W5'] },
      { step: 6, phase: 'W6 SWOT', tag: '分析', tagType: 'purple', desc: 'AI 生成 SWOT 矩阵与战略建议，明确项目优势劣势', pages: ['W6'] },
      { step: 7, phase: 'W7 需求澄清', tag: '需求', tagType: 'purple', desc: 'AI 追问澄清项目核心需求，确保方案贴合实际', pages: ['W7'] },
      { step: 8, phase: 'W8 战略定位', tag: '定位', tagType: 'blue', desc: '输出战略定位与项目命名建议，经过滤算法输出最优方案', pages: ['W8'] },
      { step: 9, phase: 'W9 三向成果', tag: '成果', tagType: 'green', desc: '生成三份报告：合规报告、空间规划、市场策略', pages: ['W9'] }
    ]
  },

  onLoad() {
    const s4 = mockData.s4_guide || {}
    this.setData({
      data: {
        dataRule: (s4.dataRule && s4.dataRule.value) ? s4.dataRule.value : '数据优先级规则：1. 官方API > 2. AI聚合 > 3. 人工修正',
        legal: '本系统所有输出仅供参考，最终决策请以政府正式批文为准。AI 聚合数据可能存在时效性问题，建议在关键节点进行人工复核。数据溯源标签中的「官方API」为预留接口，当前版本使用模拟数据。'
      }
    })
  },

  onConfirmAndNext() {
    // 直接进入 W2 地块框选（S4 已包含工作流程说明，无需单独 S5 页）
    wx.navigateTo({
      url: '/pages/w1-land/index',
      fail: () => { wx.redirectTo({ url: '/pages/w1-land/index' }) }
    })
  },

  onGoBack() {
    wx.navigateBack({ delta: 1 })
  }
})
