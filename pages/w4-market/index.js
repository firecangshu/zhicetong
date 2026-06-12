// pages/w5-market/index.js
// W5 市场调研 V2.8 全量预埋版（含图表）
const { mockData } = require('../../utils/mock-data.js')
const trace = require('../../utils/trace.js')

Page({
  data: {
    isConfirmed: false,
    confirmText: '我已核对市场调研数据，数据无误',
    // PEST
    pestPoliticalValue: '',
    pestPoliticalSourceType: '',
    pestPoliticalManualNote: '',
    pestEconomicValue: '',
    pestEconomicSourceType: '',
    pestEconomicManualNote: '',
    pestSocialValue: '',
    pestSocialSourceType: '',
    pestSocialManualNote: '',
    pestTechnologicalValue: '',
    pestTechnologicalSourceType: '',
    pestTechnologicalManualNote: '',
    // 客源市场
    touristSourceCoreValue: '',
    touristSourceCoreSourceType: '',
    touristSourceCoreManualNote: '',
    touristSourceSecondaryValue: '',
    touristSourceSecondarySourceType: '',
    touristSourceSecondaryManualNote: '',
    touristSourcePotentialValue: '',
    touristSourcePotentialSourceType: '',
    touristSourcePotentialManualNote: '',
    // 商圈分布
    businessCoreLabel: '',
    businessCorePopulation: '',
    businessCoreSupply: '',
    businessCoreGap: '',
    businessCoreSourceType: '',
    businessCoreManualNote: '',
    businessSecondaryLabel: '',
    businessSecondaryPopulation: '',
    businessSecondarySupply: '',
    businessSecondaryGap: '',
    businessSecondarySourceType: '',
    businessSecondaryManualNote: '',
    businessTertiaryLabel: '',
    businessTertiaryPopulation: '',
    businessTertiarySupply: '',
    businessTertiaryGap: '',
    businessTertiarySourceType: '',
    businessTertiaryManualNote: '',
    // 交通可达性
    accessibilitySelfValue: '',
    accessibilitySelfSourceType: '',
    accessibilitySelfManualNote: '',
    accessibilityPublicValue: '',
    accessibilityPublicSourceType: '',
    accessibilityPublicManualNote: '',
    // 竞合分析（三级）
    competitorLevels: [],
    // 图表数据：竞合力条形图
    competitorBarData: [
      { name: '我方', value: 78, color: '#1A6DFF' },
      { name: '区级竞品', value: 62, color: '#E53935' },
      { name: '市级竞品', value: 85, color: '#F5A623' },
      { name: '溢出机会', value: 55, color: '#00B365' }
    ]
  },

  onLoad() {
    const w5 = mockData.w5_market
    this.setData({
      pestPoliticalValue: w5.pest.political.value,
      pestPoliticalSourceType: w5.pest.political.sourceType,
      pestPoliticalManualNote: w5.pest.political.manualNote,
      pestEconomicValue: w5.pest.economic.value,
      pestEconomicSourceType: w5.pest.economic.sourceType,
      pestEconomicManualNote: w5.pest.economic.manualNote,
      pestSocialValue: w5.pest.social.value,
      pestSocialSourceType: w5.pest.social.sourceType,
      pestSocialManualNote: w5.pest.social.manualNote,
      pestTechnologicalValue: w5.pest.technological.value,
      pestTechnologicalSourceType: w5.pest.technological.sourceType,
      pestTechnologicalManualNote: w5.pest.technological.manualNote,
      touristSourceCoreValue: w5.touristSource.core.value,
      touristSourceCoreSourceType: w5.touristSource.core.sourceType,
      touristSourceCoreManualNote: w5.touristSource.core.manualNote,
      touristSourceSecondaryValue: w5.touristSource.secondary.value,
      touristSourceSecondarySourceType: w5.touristSource.secondary.sourceType,
      touristSourceSecondaryManualNote: w5.touristSource.secondary.manualNote,
      touristSourcePotentialValue: w5.touristSource.potential.value,
      touristSourcePotentialSourceType: w5.touristSource.potential.sourceType,
      touristSourcePotentialManualNote: w5.touristSource.potential.manualNote,
      businessCoreLabel: w5.businessDistricts.coreDistrict.label,
      businessCorePopulation: w5.businessDistricts.coreDistrict.population,
      businessCoreSupply: w5.businessDistricts.coreDistrict.supply,
      businessCoreGap: w5.businessDistricts.coreDistrict.gap,
      businessCoreSourceType: w5.businessDistricts.coreDistrict.sourceType,
      businessCoreManualNote: w5.businessDistricts.coreDistrict.manualNote,
      businessSecondaryLabel: w5.businessDistricts.secondaryDistrict.label,
      businessSecondaryPopulation: w5.businessDistricts.secondaryDistrict.population,
      businessSecondarySupply: w5.businessDistricts.secondaryDistrict.supply,
      businessSecondaryGap: w5.businessDistricts.secondaryDistrict.gap,
      businessSecondarySourceType: w5.businessDistricts.secondaryDistrict.sourceType,
      businessSecondaryManualNote: w5.businessDistricts.secondaryDistrict.manualNote,
      businessTertiaryLabel: w5.businessDistricts.tertiaryDistrict.label,
      businessTertiaryPopulation: w5.businessDistricts.tertiaryDistrict.population,
      businessTertiarySupply: w5.businessDistricts.tertiaryDistrict.supply,
      businessTertiaryGap: w5.businessDistricts.tertiaryDistrict.gap,
      businessTertiarySourceType: w5.businessDistricts.tertiaryDistrict.sourceType,
      businessTertiaryManualNote: w5.businessDistricts.tertiaryDistrict.manualNote,
      accessibilitySelfValue: w5.accessibility.selfDriving.value,
      accessibilitySelfSourceType: w5.accessibility.selfDriving.sourceType,
      accessibilitySelfManualNote: w5.accessibility.selfDriving.manualNote,
      accessibilityPublicValue: w5.accessibility.publicTransport.value,
      accessibilityPublicSourceType: w5.accessibility.publicTransport.sourceType,
      accessibilityPublicManualNote: w5.accessibility.publicTransport.manualNote,
      competitorLevels: this._buildCompetitorLevels(w5.competitorsByScope)
    })

    // 商圈条形图：简洁数值 + 宽度计算（maxPop×1.4 留30%富余，防止顶满）
    const barVals = this._buildBarValues(w5.businessDistricts)
    const maxPop = Math.max(barVals.coreNum, barVals.secondaryNum, barVals.tertiaryNum, 1) * 1.4
    this.setData({
      barCoreValue: barVals.coreText,
      barSecondaryValue: barVals.secondaryText,
      barTertiaryValue: barVals.tertiaryText,
      barCoreWidth: Math.min(85, Math.max(20, Math.round(barVals.coreNum / maxPop * 100))),
      barSecondaryWidth: Math.min(85, Math.max(20, Math.round(barVals.secondaryNum / maxPop * 100))),
      barTertiaryWidth: Math.min(85, Math.max(20, Math.round(barVals.tertiaryNum / maxPop * 100))),
      barCoreSub: barVals.coreSub,
      barSecondarySub: barVals.secondarySub,
      barTertiarySub: barVals.tertiarySub
    })
  },

  _buildBarValues(districts) {
    const extract = (popStr) => {
      const m = popStr.match(/约?(\d+(?:\.\d+)?)\s*万/)
      if (m) {
        const num = parseFloat(m[1])
        const sub = popStr.replace(/约?\d+(?:\.\d+)?\s*万\s*人?\s*[（(](.+?)[)）]/, '$1').replace(/约?\d+(?:\.\d+)?\s*万\s*人?/, '').trim()
        return { num, text: num + '万人', sub: sub || '' }
      }
      // 纯文字描述（如机会商圈）
      return { num: 0, text: popStr.length > 8 ? popStr.substring(0, 8) + '…' : popStr, sub: '' }
    }
    const core = extract(districts.coreDistrict.population)
    const secondary = extract(districts.secondaryDistrict.population)
    const tertiary = extract(districts.tertiaryDistrict.population)
    return { coreNum: core.num, coreText: core.text, coreSub: core.sub, secondaryNum: secondary.num, secondaryText: secondary.text, secondarySub: secondary.sub, tertiaryNum: tertiary.num, tertiaryText: tertiary.text, tertiarySub: tertiary.sub }
  },

  _parsePopulation(str) {
    const m = str.match(/(\d+(\.\d+)?)/)
    return m ? parseFloat(m[1]) : 0
  },

  onReady() {
    // CSS 条形图无需 Canvas 绘制，自动渲染
  },

  _buildCompetitorLevels(competitorsByScope) {
    const levelMap = { district: '区级', city: '市级', province: '省级' }
    return Object.keys(competitorsByScope).map(scope => ({
      level: levelMap[scope] || scope,
      scopeKey: scope,
      competitors: competitorsByScope[scope]
    }))
  },

  // 通用编辑弹窗
  onEditItem(e) {
    const key = e.currentTarget.dataset.key
    const idx = e.currentTarget.dataset.idx
    let value = ''
    let sourceType = ''
    let manualNote = ''
    let updateKey = key
    let updateSourceKey = key + 'SourceType'
    let updateNoteKey = key + 'ManualNote'
    
    // 竞合分析需要特殊处理（通过 idx 定位具体竞品）
    if (key === 'competitorDistrict' || key === 'competitorCity' || key === 'competitorProvince') {
      const levelIdx = idx !== undefined ? parseInt(idx) : 0
      const scopeMap = { competitorDistrict: 'district', competitorCity: 'city', competitorProvince: 'province' }
      const scope = scopeMap[key] || 'district'
      const comp = this.data.competitorLevels.find(l => l.scopeKey === scope)
      if (!comp || !comp.competitors[levelIdx]) return
      const item = comp.competitors[levelIdx]
      value = item.name + ' | 优势：' + item.advantage + ' | 劣势：' + item.disadvantage
      sourceType = item.sourceType
      manualNote = item.manualNote
      this._editCompetitor(scope, levelIdx, item)
      return
    }
    
    // 普通字段：需要根据 key 计算正确的显示字段名
    // WXML中绑定的是 key + 'Value'（如 pestPoliticalValue）
    // 但商圈类字段绑定的是 key + 'Population'/'Supply'/'Gap'
    const valueKeyMap = {
      pestPolitical: 'pestPoliticalValue',
      pestEconomic: 'pestEconomicValue',
      pestSocial: 'pestSocialValue',
      pestTechnological: 'pestTechnologicalValue',
      touristSourceCore: 'touristSourceCoreValue',
      touristSourceSecondary: 'touristSourceSecondaryValue',
      touristSourcePotential: 'touristSourcePotentialValue',
      accessibilitySelf: 'accessibilitySelfValue',
      accessibilityPublic: 'accessibilityPublicValue'
    }
    
    if (valueKeyMap[key]) {
      updateKey = valueKeyMap[key]
    }
    
    value = this.data[updateKey] || ''
    sourceType = this.data[updateSourceKey] || ''
    manualNote = this.data[updateNoteKey] || ''

    wx.showModal({
      title: '修正数据或添加备注',
      content: '请输入修正后的数据或备注：',
      editable: true,
      placeholderText: value.substring(0, 50) + (value.length > 50 ? '...' : ''),
      success: (res) => {
        if (res.confirm) {
          const updateData = {}
          if (res.content) {
            updateData[updateKey] = res.content
            updateData[updateNoteKey] = '人工修正：' + res.content.substring(0, 20) + (res.content.length > 20 ? '...' : '')
          }
          this.setData(updateData)
          // 记录用户修正到trace（低风险：用try-catch包裹，即使失败也不影响编辑功能）
          try {
            trace.recordEdit('w4-market', key, value || '', res.content || '')
          } catch (e) {
            console.error('[Trace] recordEdit failed:', e)
          }
        }
      }
    })
  },

  // 补充内容（在原文末尾追加，不改原数据）
  onAddNote(e) {
    const key = e.currentTarget.dataset.key
    const valueKeyMap = {
      pestPolitical: 'pestPoliticalValue',
      pestEconomic: 'pestEconomicValue',
      pestSocial: 'pestSocialValue',
      pestTechnological: 'pestTechnologicalValue',
      touristSourceCore: 'touristSourceCoreValue',
      touristSourceSecondary: 'touristSourceSecondaryValue',
      touristSourcePotential: 'touristSourcePotentialValue',
      accessibilitySelf: 'accessibilitySelfValue',
      accessibilityPublic: 'accessibilityPublicValue'
    }
    const updateKey = valueKeyMap[key] || key + 'Value'
    const currentValue = this.data[updateKey] || ''

    wx.showModal({
      title: '补充内容',
      content: '请输入要补充的内容（将追加到原文末尾）：',
      editable: true,
      placeholderText: '请输入补充内容...',
      success: (res) => {
        if (res.confirm && res.content) {
          const updateData = {}
          updateData[updateKey] = currentValue + '\n【补充】' + res.content
          this.setData(updateData)
          // 记录到trace
          try {
            trace.recordEdit('w4-market', key, currentValue, updateData[updateKey])
          } catch (e) {
            console.error('[Trace] recordEdit failed:', e)
          }
        }
      }
    })
  },

  // 商圈补充内容（追加到备注字段）
  onAddBusinessNote(e) {
    const key = e.currentTarget.dataset.key // businessCore / businessSecondary / businessTertiary
    const noteKey = key + 'Note'
    const currentNote = this.data[noteKey] || ''

    wx.showModal({
      title: '补充商圈内容',
      content: '请输入要补充的内容（将追加到原文末尾）：',
      editable: true,
      placeholderText: '请输入补充内容...',
      success: (res) => {
        if (res.confirm && res.content) {
          const updateData = {}
          updateData[noteKey] = currentNote + (currentNote ? '\n【补充】' : '【补充】') + res.content
          this.setData(updateData)
          // 记录到trace
          try {
            trace.recordEdit('w4-market', key, currentNote, updateData[noteKey])
          } catch (e) {
            console.error('[Trace] recordEdit failed:', e)
          }
        }
      }
    })
  },

  // 竞合分析补充内容（追加到竞品的manualNote）
  onAddCompetitorNote(e) {
    const scope = e.currentTarget.dataset.scope
    const idx = parseInt(e.currentTarget.dataset.idx) || 0
    const levels = this.data.competitorLevels
    const level = levels.find(l => l.scopeKey === scope)
    if (!level || !level.competitors[idx]) return

    const item = level.competitors[idx]
    const currentNote = item.manualNote || ''

    wx.showModal({
      title: '补充竞品内容',
      content: '请输入要补充的内容（将追加到原文末尾）：',
      editable: true,
      placeholderText: '请输入补充内容...',
      success: (res) => {
        if (res.confirm && res.content) {
          item.manualNote = currentNote + (currentNote ? '\n【补充】' : '【补充】') + res.content
          // 强制深拷贝，确保视图层能感知变化
          this.setData({
            competitorLevels: JSON.parse(JSON.stringify(levels))
          })
          // 记录到trace
          try {
            trace.recordEdit('w4-market', 'competitor' + scope, currentNote, item.manualNote)
          } catch (e) {
            console.error('[Trace] recordEdit failed:', e)
          }
        }
      }
    })
  },

  _editCompetitor(scope, idx, item) {
    wx.showModal({
      title: '修正竞品数据或添加备注',
      content: '请输入修正后的数据或备注：',
      editable: true,
      placeholderText: item.name,
      success: (res) => {
        if (res.confirm && res.content) {
          const levels = this.data.competitorLevels
          const level = levels.find(l => l.scopeKey === scope)
          if (level && level.competitors[idx]) {
            level.competitors[idx].manualNote = '人工修正：' + res.content.substring(0, 20) + (res.content.length > 20 ? '...' : '')
            // 强制深拷贝，确保视图层能感知变化
            this.setData({
              competitorLevels: JSON.parse(JSON.stringify(levels))
            })
          }
        }
      }
    })
  },

  onToggleConfirm() {
    this.setData({ isConfirmed: !this.data.isConfirmed })
  },

  onNext() {
    if (!this.data.isConfirmed) {
      wx.showToast({ title: '请先确认市场调研数据', icon: 'none' })
      return
    }
    wx.navigateTo({
      url: '/pages/w5-redline/index',
      fail: () => wx.redirectTo({ url: '/pages/w5-redline/index' })
    })
  },

  onGoBack() {
    wx.navigateBack({ delta: 1 })
  }
})
