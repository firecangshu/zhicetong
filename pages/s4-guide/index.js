// pages/s4-guide/index.js
// S4 使用流程引导页 - 暗色科技风

Page({
  data: {
    timelineSteps: [
      {
        step: 1,
        phase: 'W1 地块框选',
        tag: '腾讯地图地理',
        tagColor: '#7EC8E3',
        tagBg: 'rgba(126,200,227,0.13)',
        desc: '在地图上框选目标地块，输入坐标'
      },
      {
        step: 2,
        phase: 'W2 资源调查',
        tag: 'AI聚合/API抓取',
        tagColor: '#A8E6CF',
        tagBg: 'rgba(168,230,207,0.13)',
        desc: 'AI 评析地块周边文旅资源禀赋'
      },
      {
        step: 3,
        phase: 'W3 政策引导',
        tag: '官方API',
        tagColor: '#FFD3B6',
        tagBg: 'rgba(255,211,182,0.13)',
        desc: '四级政策库匹配，研判政策红利与合规要求'
      },
      {
        step: 4,
        phase: 'W4 市场调研',
        tag: 'AI爬虫',
        tagColor: '#FF8B94',
        tagBg: 'rgba(255,139,148,0.13)',
        desc: '商圈分析、客源市场、竞合分析'
      },
      {
        step: 5,
        phase: 'W5 法规红线',
        tag: '官方数据',
        tagColor: '#D4A5FF',
        tagBg: 'rgba(212,165,255,0.13)',
        desc: '三区三线检测，确保项目合规'
      },
      {
        step: 6,
        phase: 'W6 SWOT',
        tag: 'AI分析',
        tagColor: '#87CEEB',
        tagBg: 'rgba(135,206,235,0.13)',
        desc: 'AI生成SWOT矩阵与战略建议'
      },
      {
        step: 7,
        phase: 'W7 需求澄清',
        tag: 'AI对话',
        tagColor: '#FFB347',
        tagBg: 'rgba(255,179,71,0.13)',
        desc: 'AI 提问澄清项目核心需求'
      },
      {
        step: 8,
        phase: 'W8 战略定位',
        tag: '算法验证',
        tagColor: '#B0E0E6',
        tagBg: 'rgba(176,224,230,0.15)',
        desc: '输出战略定位与项目命名建议'
      },
      {
        step: 9,
        phase: 'W9 三向成果',
        tag: 'AI生成',
        tagColor: '#FFB6C1',
        tagBg: 'rgba(255,182,193,0.13)',
        desc: '生成三份报告：合规、空间、市场'
      }
    ],
    dataRule: '数据核对：官方API和AI聚合数据均可进行人工修正和增加。'
  },

  onLoad() {
    console.log('[S4] 使用流程引导页加载');
  },

  onShow() {
    // 页面显示时触发
  },

  // 确认并继续 - 跳转到W1地块选择
  onConfirmAndNext() {
    wx.redirectTo({
      url: '/pages/w1-land/index',
      fail: () => {
        wx.showToast({
          title: 'W1页面开发中',
          icon: 'none'
        });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '踏歌行智策通 - 使用流程',
      path: '/pages/s1-cover/index'
    };
  }
});
