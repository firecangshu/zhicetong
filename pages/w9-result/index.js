// pages/w9-result/index.js
// W9 成果交付页面 V2.2 — 集成四维引擎 + 决策日志
const { mockData } = require('../../utils/mock-data.js')
const engine = require('../../utils/engine.js')
const trace = require('../../utils/trace.js')

Page({
  data: {
    navHeight: 44,
    statusBarHeight: 20,
    summary: {
      land: '',
      resource: '',
      policy: '',
      market: '',
      regulation: '',
      demand: ''
    },
    recommendation: {
      name: '',
      tag: '',
      desc: '',
      roi: '',
      payback: '',
      capacity: ''
    },
    reports: {
      investor: { date: '2026-06-01', pages: 6, icon: '💰', name: '投资方战略分析建议书', hint: '战略价值·投资回报·风险评估' },
      planner: { date: '2026-06-01', pages: 8, icon: '🏗️', name: '规划方设计素材汇总', hint: '地块条件·资源禀赋·合规边界' },
      promoter: { date: '2026-06-01', pages: 5, icon: '🤝', name: '招商方招商评估建议书', hint: '市场定位·客群分析·招商策略' }
    },
    traceHistory: [],
    safetyAlerts: []
  },

  onLoad() {
    // 计算自定义导航栏高度
    const sys = wx.getSystemInfoSync()
    const menu = wx.getMenuButtonBoundingClientRect()
    const statusBarHeight = sys.statusBarHeight || 20
    const navHeight = (menu.top - statusBarHeight) * 2 + menu.height
    this.setData({ statusBarHeight, navHeight })
    const w2 = mockData.w2_land || {}
    const w3 = mockData.w3_resource || {}
    const w4 = mockData.w4_policy || {}
    const w5 = mockData.w5_market || {}
    const w6 = mockData.w6_redline || {}
    const w8 = mockData.w8_demand || {}
    const w9 = mockData.w9_position || {}

    // ========== 地块 ==========
    const landName = (w2.officialName || {}).value || '待确认地块'
    const landArea = (w2.area || {}).value || ''

    // ========== 资源 ==========
    // W3 是单个字段对象，统计有值的关键资源项
    const resourceKeys = ['geomorphology','naturalLandscape','surfaceWater','vegetation','wildlife']
    const resourceCount = resourceKeys.filter(k => (w3[k] || {}).value).length
    const resourceHint = resourceCount > 0
      ? `已采集 ${resourceCount} 类资源（地文·水域·生物）`
      : '未采集资源'

    // ========== 政策 ==========
    const policies = w4.policies || []
    const policyHint = policies.length > 0
      ? `${policies[0].name} 等 ${policies.length} 条政策`
      : '未匹配政策'

    // ========== 市场 ==========
    const touristSource = w5.touristSource || {}
    const marketCore = (touristSource.core || {}).value || ''
    // 提取核心客群关键词
    const marketHint = marketCore
      ? (marketCore.match(/核心客源：(.+?)[。；]/) || [])[1] || '客群已分析'
      : '待分析'

    // ========== 合规 ==========
    const threeLines = w6.threeLines || {}
    const redLineItems = Object.values(threeLines)
    const hasWarning = redLineItems.some(item => item.status === 'warning')
    const warningName = hasWarning
      ? (redLineItems.find(item => item.status === 'warning') || {}).value || ''
      : ''
    const regulationHint = hasWarning
      ? '⚠️ ' + (warningName.split('。')[0] || '存在红线')
      : '✅ 无硬性红线'

    // ========== 诉求 ==========
    const demands = w8.clientDemands || []
    const demandHint = demands.length > 0
      ? `${demands[0].question} 等 ${demands.length} 项诉求`
      : '未录入诉求'

    // 推导新增字段（供 engine.js R014/R015/R016 使用）
    const demandIntensity = marketCore.indexOf('研学') !== -1 || marketCore.indexOf('亲子') !== -1 ? '高' : '中'
    // 从 w9_position.dataSummary.demand 解析预算（单位：万元）
    const budgetStr = ((w9.dataSummary || {}).demand || '')
    const budgetMatch = budgetStr.match(/预算[≤≤]?(\d+)万/)
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : 8000
    // 从 w5.accessibility 推导交通可达性
    const selfDriveValue = ((w5.accessibility || {}).selfDriving || {}).value || ''
    let transport = '>2h'
    if (selfDriveValue.indexOf('15分钟') !== -1 || selfDriveValue.indexOf('40分钟') !== -1) {
      transport = '<1h'
    } else if (selfDriveValue.indexOf('50分钟') !== -1 || selfDriveValue.indexOf('1小时') !== -1) {
      transport = '1-2h'
    }

    const summary = {
      land: landName + (landArea ? ' · ' + landArea : ''),
      resource: resourceHint,
      policy: policyHint,
      market: marketHint,
      regulation: regulationHint,
      demand: demandHint
    }

    // ========== 最终推荐方案 ==========
    const rec = w9.recommendations || []
    const best = rec.find(r => r.level === '优选') || rec[0] || {}
    const naming = w9.naming || {}
    const projectName = (naming.projectName || {}).value || '定远森系研学营地'
    // 去掉品牌前缀
    const cleanName = projectName.replace(/^踏歌行[·•]?\s*/, '')

    // ========== 四维引擎评分 ==========
    // 从分散的 mock data 构造引擎输入参数
    var engineParams = {
      land: {
        area: (w2.officialName || {}).value || '',
        terrain: (w2.terrain || {}).value || ''
      },
      resource: {
        landType: resourceCount > 3 ? '林地/岗丘' : '其他',
        landscape: resourceCount > 4 ? '复合' : '单一'
      },
      policy: {
        policies: policies.map(function(p) {
          return { name: p.name, level: p.level, direction: '利好' }
        })
      },
      market: {
        cycle: '5–6年',
        position: marketCore.indexOf('近郊') !== -1 ? '近郊' : '远郊',
        demand: marketCore.indexOf('研学') !== -1 || marketCore.indexOf('亲子') !== -1 ? '研学亲子' : '文旅',
        chartData: { series: [{ data: [8, 6, 4] }] },
        // 新增：供 R014/R015/R016 使用
        demandIntensity: demandIntensity,
        budget: budget,
        transport: transport
      },
      redline: {
        eco: (w6.threeLines || {}).ecoRedLine ? ((w6.threeLines.ecoRedLine.value || '').indexOf('✅') !== -1 ? '✅ 不涉及' : '❌ 冲突') : '数据不足',
        farm: (w6.threeLines || {}).farmland ? ((w6.threeLines.farmland.value || '').indexOf('✅') !== -1 ? '✅ 不涉及' : '⚠️ 涉及少量基本农田') : '数据不足',
        build: (w6.threeLines || {}).urbanBoundary ? ((w6.threeLines.urbanBoundary.value || '').indexOf('✅') !== -1 ? '✅ 不涉及' : '⚠️ 需审批') : '数据不足'
      }
    }

    // 执行四维评分
    var evalResult = engine.evaluate(engineParams)

    // 记录决策日志
    var traceId = trace.record(engineParams, evalResult)
    console.log('[W9] engine评分结果:', evalResult.verdict, evalResult.totalScore + '分', 'traceId:', traceId)

    this.setData({
      summary,
      recommendation: {
        name: cleanName,
        tag: best.tag || '优选方案',
        desc: best.strategy || '基于全流程数据研判，推荐此方案',
        roi: best.roi || '18%',
        payback: best.payback || '4.2年',
        capacity: best.capacity || '200人/天'
      },
      evalResult: evalResult
    })

    // 加载决策历史
    this.loadTraceHistory()

    // 构建安全提示
    this._buildSafetyAlerts(engineParams, evalResult)
  },

  // 构建安全提示
  _buildSafetyAlerts(params, result) {
    const alerts = []
    const budget = (params.market || {}).budget || 0
    const transport = (params.market || {}).transport || ''
    const policies = (params.policy || {}).policies || []
    const ecoRedLine = (params.redline || {}).eco || ''

    // 1. 预算超支预警（>300万）
    if (budget > 300) {
      alerts.push({
        type: 'warning',
        icon: '⚠️',
        title: '预算超支预警',
        desc: `当前预算${budget}万，超过建议值300万，请重新评估投资回报周期。`
      })
    }

    // 2. 交通可达性预警（>2h）
    if (transport === '>2h') {
      alerts.push({
        type: 'warning',
        icon: '⚠️',
        title: '交通可达性预警',
        desc: '距离市区>2小时，可能影响客流量与运营效率，建议重新选址或加强线上营销。'
      })
    }

    // 3. 政策红利提示（无国家级/省级政策）
    const hasHighLevelPolicy = policies.some(p => p.level === '国家级' || p.level === '省级')
    if (!hasHighLevelPolicy) {
      alerts.push({
        type: 'info',
        icon: '💡',
        title: '政策红利提示',
        desc: '当前无高级别政策支持，建议进一步核实地方补贴与税收优惠。'
      })
    }

    // 4. 生态红线一票否决（严重）
    if (ecoRedLine.indexOf('❌') !== -1) {
      alerts.push({
        type: 'danger',
        icon: '🚫',
        title: '生态红线一票否决',
        desc: '项目涉及生态红线，无法推进，请立即重新选址。',
        fatal: true
      })
    }

    this.setData({ safetyAlerts: alerts })
  },

  // 页面显示时刷新决策历史
  onShow() {
    this.loadTraceHistory()
  },

  // 加载决策历史记录
  loadTraceHistory() {
    var history = trace.getHistory() || []
    // trace.js存储结构为 item.output.{verdict,totalScore}
    // 过滤掉无效记录，取最近5条，倒序
    var validHistory = history.filter(function(item) {
      var out = item.output || {}
      return out.verdict && out.totalScore > 0
    })
    var recent = validHistory.slice(-5).reverse()
    // 格式化时间
    var formatted = recent.map(function(item) {
      var d = new Date(item.timestamp)
      var month = (d.getMonth() + 1).toString()
      var day = d.getDate().toString()
      var hour = d.getHours().toString()
      var min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()
      return {
        verdict: item.output.verdict,
        score: item.output.totalScore,
        time: month + '月' + day + '日 ' + hour + ':' + min
      }
    })

    // 计算图表数据（柱状图高度 = score * 3rpx，最小20rpx）
    var chartData = formatted.map(function(item) {
      var labelMap = {
        'GO': '通过',
        'CONDITIONAL': '条件',
        'PAUSE': '暂停',
        'NO-GO': '否决'
      }
      return {
        verdict: item.verdict,
        score: item.score,
        height: Math.max(20, Math.round(item.score * 3)),
        label: labelMap[item.verdict] || item.verdict
      }
    })

    this.setData({
      traceHistory: formatted,
      traceChartData: chartData
    })
  },

  // 查看单份报告（模拟）
  onViewReport(e) {
    const type = e.currentTarget.dataset.type
    const nameMap = {
      screening: '机筛报告',
      field: '实地调研报告',
      demand: '需求确认书'
    }
    wx.showModal({
      title: nameMap[type] || '报告',
      content: '报告预览功能需接入 PDF 预览组件，当前为模拟演示。\n\n实际交付时将生成完整 PDF 文件。',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 一键导出全套报告（模拟）
  onExportAll() {
    wx.showLoading({ title: '正在生成报告…' })
    setTimeout(() => {
      wx.hideLoading()
      wx.showModal({
        title: '导出成功（模拟）',
        content: '已生成三份报告：\n1. 机筛报告（8页）\n2. 实地调研报告（4页）\n3. 需求确认书（3页）\n\n实际交付时将自动打包为 ZIP 或发送至邮箱。',
        showCancel: false,
        confirmText: '好的'
      })
    }, 1500)
  },

  // 导出单份报告（模拟）
  onExportSingle(e) {
    const type = e.currentTarget.dataset.type
    const nameMap = {
      screening: '机筛报告',
      field: '实地调研报告',
      demand: '需求确认书'
    }
    wx.showLoading({ title: '正在生成 PDF…' })
    setTimeout(() => {
      wx.hideLoading()
      wx.showModal({
        title: '导出成功（模拟）',
        content: nameMap[type] + ' 已生成，实际交付时将下载 PDF 文件。',
        showCancel: false,
        confirmText: '好的'
      })
    }, 1000)
  },

  // 打开三方角色报告页（MVP版改为弹窗展示，替代已移除的w11-reports页面）
  onOpenRoleReport(e) {
    const role = e.currentTarget.dataset.role
    const roleMap = {
      investor: { title: '投资方战略分析建议书', content: '侧重：战略价值·投资回报·风险评估\n\n建议书内容基于W1-W9全流程数据汇总，包含：\n1. 地块条件与资源禀赋\n2. 四维引擎评分结果\n3. 投资回报预测\n4. 风险提示与建议\n\n（MVP演示版，完整PDF导出功能待实现）' },
      planner: { title: '规划方设计素材汇总', content: '侧重：地块条件·资源禀赋·合规边界\n\n设计素材汇总基于W1-W9全流程数据，包含：\n1. 地块地形与生态基底\n2. 空间布局建议\n3. 合规边界（三区三线）\n4. 建设时序建议\n\n（MVP演示版，完整PDF导出功能待实现）' },
      promoter: { title: '招商方招商评估建议书', content: '侧重：市场定位·客群分析·招商策略\n\n招商评估建议书基于W4-W5市场调研数据，包含：\n1. 市场定位与核心客群\n2. 竞合分析\n3. 政策红利清单\n4. 合作模式建议\n\n（MVP演示版，完整PDF导出功能待实现）' }
    }
    const info = roleMap[role] || { title: '报告', content: '报告内容生成中...' }
    wx.showModal({
      title: info.title,
      content: info.content,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 重新开始（reLaunch 清空页面栈，防止栈溢出）
  onRestart() {
    wx.showModal({
      title: '确认重新开始？',
      content: '将清空当前项目数据，回到封面页重新开始。',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.reLaunch({ url: '/pages/s1-cover/index' })
        }
      }
    })
  },

  onGoBack() {
    wx.navigateBack({ delta: 1 })
  }
})
