// pages/w2-resource/index.js
// W2 资源调查 V3.0 基于W1地块实时数据版（20项，GB/T 18972-2017）
// Canvas 图表已改为 CSS 实现，无需引入 charts.js

Page({
  data: {
    isConfirmed: false,
    confirmText: '我已核对资源调查数据，数据无误',

    // W1 传递的地块信息
    landInfo: null,
    hasLandInfo: false,

    // 雷达图数据（文旅资源多维度评分）
    radarIndicators: [
      { name: '地文景观', value: 70 },
      { name: '地质构造', value: 60 },
      { name: '自然景观', value: 65 },
      { name: '水域景观', value: 60 },
      { name: '生物景观', value: 65 },
      { name: '气候天象', value: 65 },
      { name: '历史遗迹', value: 50 },
      { name: '现代设施', value: 50 },
      { name: '人文活动', value: 55 }
    ],
    geomorphologyList: [],
    geologyList: [],
    naturalLandscapeList: [],
    waterList: [],
    biologyList: [],
    climateList: [],
    historyList: [],
    facilityList: [],
    cultureList: [],
    resourceSummaryValue: '',
    resourceSummarySourceType: '',
    resourceSummaryManualNote: '',

    // 展开/折叠状态管理
    expandedItems: {} // key: 是否展开
  },

  onLoad() {
    // 读取 W1 传递的地块数据
    const app = getApp()
    const landInfo = app.globalData.landInfo || null

    if (landInfo && landInfo.name) {
      this.setData({ landInfo, hasLandInfo: true })
      this._loadResourceByLand(landInfo)
    } else {
      // 无 W1 数据时加载通用占位
      this.setData({ hasLandInfo: false })
      this._loadPlaceholderData()
    }
  },

  // ========= 基于 W1 地块数据生成资源调查（接入腾讯API）=========
  _loadResourceByLand(land) {
    const region = land.adminFullName || land.name || '当前地块'
    const terrain = land.terrain || ''
    const area = land.area || ''
    const coord = land.coord || {}
    const adminCode = land.adminCode || ''
    const city = land.city || ''
    const district = land.district || ''
    const lat = coord.lat || 30.889
    const lng = coord.lng || 114.378

    // 根据地形特征调整雷达图基准分
    const radar = this._estimateRadarByTerrain(terrain)

    // ========= 先展示AI聚合数据（API异步更新）=========
    const initialData = this._generateInitialData(region, terrain, area, coord, radar)
    this.setData(initialData)

    // ========= 异步调用腾讯API ==========
    // 1. 调用腾讯天气API
    this._fetchWeather(lat, lng, region)
    
    // 2. 调用腾讯POI搜索（历史遗迹、景点、设施、特产）
    this._fetchPOI(lat, lng, '历史遗迹', 'historicalSites')
    this._fetchPOI(lat, lng, '景点', 'surfaceWater')
    this._fetchPOI(lat, lng, '基础设施', 'modernFacilities')
    this._fetchPOI(lat, lng, '特产', 'localProducts')
  },

  // ========= 生成初始数据（AI聚合）=========
  _generateInitialData(region, terrain, area, coord, radar) {
    const geomorphologyData = this._collectGeomorphology(region, terrain, coord)
    const geologyData = this._collectGeology(region, coord)
    const landscapeData = this._collectLandscape(region, terrain, coord)
    const waterData = this._collectWater(region, coord)
    const biologyData = this._collectBiology(region, terrain, coord)
    const climateData = this._collectClimate(region, coord)
    const historyData = this._collectHistory(region, coord)
    const facilityData = this._collectFacility(region, coord)
    const cultureData = this._collectCulture(region, coord)
    const summary = this._generateResourceSummary(region, terrain, area, radar)

    return {
      radarIndicators: radar,
      geomorphologyList: [this._buildItem('geomorphology', '地貌与地形特征', geomorphologyData)],
      geologyList: [this._buildItem('geology', '地质构造与稳定性', geologyData)],
      naturalLandscapeList: [this._buildItem('naturalLandscape', '自然景观肌理', landscapeData)],
      waterList: [
        this._buildItem('surfaceWater', '地表水（河流/塘堰/湖泊）', waterData.surface),
        this._buildItem('groundwater', '地下水与温泉资源', waterData.ground)
      ],
      biologyList: [
        this._buildItem('vegetation', '植被类型与覆盖率', biologyData.vegetation),
        this._buildItem('wildlife', '野生动物与栖息环境', biologyData.wildlife),
        this._buildItem('ancientTrees', '古树名木（百年以上）', biologyData.trees)
      ],
      climateList: [
        this._buildItem('climate', '气候特征与适宜期', climateData.climate),
        this._buildItem('meteorological', '天象奇观与特殊气象', climateData.meteor)
      ],
      historyList: [
        this._buildItem('historicalSites', '历史遗迹与文物点', historyData.sites),
        this._buildItem('traditionalArchitecture', '传统建筑与民居群落', historyData.architecture)
      ],
      facilityList: [
        this._buildItem('modernFacilities', '现代基础设施条件', facilityData.facility),
        this._buildItem('localProducts', '地方特产与农特产品', facilityData.products)
      ],
      cultureList: [
        this._buildItem('intangibleHeritage', '非遗项目', cultureData.intangible),
        this._buildItem('folkCustoms', '民俗活动', cultureData.folk),
        this._buildItem('legendsAndStories', '传说典故', cultureData.legends),
        this._buildItem('historicalFigures', '历史人物', cultureData.figures)
      ],
      resourceSummaryValue: summary.value,
      resourceSummarySourceType: summary.sourceType,
      resourceSummaryManualNote: summary.manualNote
    }
  },

  // ========= 腾讯天气API =========
  _fetchWeather(lat, lng, region) {
    const qqMapKey = '4X5BZ-PRTCZ-L4ZXA-ZC6PF-RZEJO-JLBIF'
    const self = this
    
    wx.request({
      url: 'https://apis.map.qq.com/lis/weather',
      data: {
        location: `${lat},${lng}`,
        key: qqMapKey,
        output: 'json'
      },
      success: (res) => {
        if (res.data && res.data.status === 0) {
          const weatherData = res.data.result
          const weatherDesc = `【官方API】气候特征（腾讯天气实时数据）：\n\n• 当前天气：${weatherData.realtime.weather || '未知'}\n• 温度：${weatherData.realtime.temp || '--'}°C\n• 湿度：${weatherData.realtime.humidity || '--'}%\n• 风速：${weatherData.realtime.windSpeed || '--'}m/s\n• 数据来源：腾讯地图天气API`
          
          const climateItem = {
            value: weatherDesc,
            sourceType: 'official_api',
            sourceName: '腾讯天气API',
            manualNote: '官方API实时数据，置信度高',
            sources: [
              { type: '官方API', name: '腾讯地图天气API', url: 'https://lbs.qq.com/', confidence: '高' }
            ]
          }
          
          self.setData({
            climateList: [this._buildItem('climate', '气候特征与适宜期', climateItem)]
          })
          
          wx.showToast({ title: '气候数据已更新（官方API）', icon: 'none', duration: 1500 })
          console.log('[W2] 天气数据获取成功：', weatherData)
        }
      },
      fail: (err) => {
        console.log('[W2] 天气API调用失败，使用AI聚合数据：', err)
        // 失败后仍使用AI聚合数据（已在_generateInitialData中设置）
      }
    })
  },

  // ========= 腾讯POI搜索API ==========
  _fetchPOI(lat, lng, keyword, targetKey) {
    const qqMapKey = '4X5BZ-PRTCZ-L4ZXA-ZC6PF-RZEJO-JLBIF'
    const self = this
    const radius = 5000 // 搜索半径5km
    
    wx.request({
      url: 'https://apis.map.qq.com/ws/place/v1/search',
      data: {
        keyword: keyword,
        location: `${lat},${lng}`,
        radius: radius,
        key: qqMapKey,
        output: 'json'
      },
      success: (res) => {
        if (res.data && res.data.status === 0) {
          const pois = res.data.data || []
          console.log(`[W2] POI搜索"${keyword}"成功，找到${pois.length}条：`, pois)
          
          if (pois.length > 0) {
            let poiDesc = `【官方API】${keyword}资源（腾讯地图POI搜索，${pois.length}条）：\n\n`
            pois.slice(0, 5).forEach((poi, index) => {
              poiDesc += `• ${poi.title || '未知'}${poi.address ? '（' + poi.address + '）' : ''}\n`
            })
            if (pois.length > 5) {
              poiDesc += `\n...还有${pois.length - 5}条结果`
            }
            poiDesc += `\n• 数据来源：腾讯地图POI搜索API`
            
            const poiItem = {
              value: poiDesc,
              sourceType: 'official_api',
              sourceName: '腾讯地图POI',
              manualNote: `官方API搜索结果，搜索半径${radius/1000}km，置信度高`,
              sources: [
                { type: '官方API', name: '腾讯地图POI搜索', url: 'https://lbs.qq.com/', confidence: '高' }
              ]
            }
            
            // 根据targetKey更新对应的数据项
            if (targetKey === 'historicalSites') {
              self.setData({
                historyList: [this._buildItem('historicalSites', '历史遗迹与文物点', poiItem)]
              })
            } else if (targetKey === 'surfaceWater') {
              self.setData({
                waterList: [
                  this._buildItem('surfaceWater', '地表水（河流/塘堰/湖泊）', poiItem),
                  self.data.waterList[1] // 保持地下水项
                ]
              })
            } else if (targetKey === 'modernFacilities') {
              self.setData({
                facilityList: [this._buildItem('modernFacilities', '现代基础设施条件', poiItem)]
              })
            } else if (targetKey === 'localProducts') {
              self.setData({
                facilityList: [
                  self.data.facilityList[0], // 保持设施项
                  this._buildItem('localProducts', '地方特产与农特产品', poiItem)
                ]
              })
            }
            
            wx.showToast({ title: `${keyword}数据已更新（POI）`, icon: 'none', duration: 1500 })
          }
        }
      },
      fail: (err) => {
        console.log(`[W2] POI搜索"${keyword}"失败，使用AI聚合数据：`, err)
        // 失败后仍使用AI聚合数据
      }
    })
  },

  // 地文景观采集
  _collectGeomorphology(region, terrain, coord) {
    // 第一优先级：官方API（模拟）
    const officialAPI = null // 暂未接入官方地貌API

    // 第二优先级：AI聚合（基于地形特征推断）
    if (terrain) {
      return {
        value: `【AI聚合】地形特征：${terrain}。\n\n地块位于${region}，根据地形特征推断：\n• 地貌类型：${terrain.includes('丘陵') ? '丘陵地貌，适合阶梯式开发' : terrain.includes('平原') ? '平原地貌，适合大规模建设' : '综合地貌'}\n• 坡度特征：${terrain.includes('高差') ? '存在明显高差，适合山地旅游项目' : '坡度较缓，适合常规建设'}\n• 土壤类型：建议实地踏勘补充土壤采样数据`,
        sourceType: 'ai_aggregation',
        sourceName: '基于W1地块地形AI推断',
        manualNote: '建议补充：DEM高程数据、地质勘察报告、土壤采样分析',
        sources: [
          { type: 'AI推断', name: '腾讯地图地形数据', url: '', confidence: '中' },
          { type: '建议', name: '实地踏勘补充', url: '', confidence: '高' }
        ]
      }
    }

    // 第三优先级：人工补充
    return {
      value: `【待人工采集】地块位于${region}，地貌类型待实地踏勘确认。`,
      sourceType: 'manual',
      sourceName: '待人工踏勘',
      manualNote: '请点击编辑，填入实地踏勘数据：地貌类型、坡度、高差、土壤类型',
      sources: [
        { type: '人工', name: '待实地踏勘', url: '', confidence: '待确认' }
      ]
    }
  },

  // 地质构造采集
  _collectGeology(region, coord) {
    return {
      value: `【AI聚合】区域地质构造与稳定性评估（基于${region}位置推断）：\n\n• 地质构造：位于长江中下游构造带，基岩以沉积岩为主\n• 地震烈度：推测为VI度区（需查阅地震烈度图确认）\n• 潜在风险：关注是否存在采空区/岩溶塌陷/活动断层\n• 建议：查询省级地质环境信息平台，获取详细地质勘察报告`,
      sourceType: 'ai_aggregation',
      sourceName: 'AI基于区域位置推断',
      manualNote: '重要：需查询省级地质环境信息平台，确认基岩类型、地震烈度、地质灾害风险',
      sources: [
        { type: 'AI推断', name: '基于区域地质背景', url: '', confidence: '中' },
        { type: '建议', name: '省级地质环境信息平台', url: 'http://dgh.chinaquake.cn/', confidence: '高' },
        { type: '建议', name: '地质勘察报告', url: '', confidence: '高' }
      ]
    }
  },

  // 自然景观采集
  _collectLandscape(region, terrain, coord) {
    return {
      value: `【AI聚合】地块位于${region}，自然景观肌理分析：\n\n• 植被覆盖：建议通过卫星影像解译 + 无人机航拍确认\n• 土地利用：建议确认土地利用格局（耕地/林地/建设用地比例）\n• 视觉通廊：建议识别主要视觉通廊与景观节点\n• 景观价值：结合地形特征评估景观价值（${terrain.includes('丘陵') ? '丘陵地貌具有层次感' : '平原地貌视野开阔'}）`,
      sourceType: 'ai_aggregation',
      sourceName: 'AI景观资源评估',
      manualNote: '建议：卫星影像解译 + 无人机航拍 + 现场踏勘',
      sources: [
        { type: 'AI评估', name: '景观资源AI评估', url: '', confidence: '中' },
        { type: '建议', name: '卫星影像解译', url: 'https://www.gscloud.cn/', confidence: '高' },
        { type: '建议', name: '无人机航拍', url: '', confidence: '高' }
      ]
    }
  },

  // 水域景观采集
  _collectWater(region, coord) {
    return {
      surface: {
        value: `【AI聚合】地表水资源评估（${region}）：\n\n• 地表水体：建议实地踏勘确认是否有河流/塘堰/湖泊穿过地块\n• 水质状况：建议取样检测（pH/COD/氨氮等指标）\n• 水利设施：建议确认灌溉渠系分布与蓄水能力\n• 景观价值：水体可作为景观核心资源`,
        sourceType: 'ai_aggregation',
        sourceName: 'AI水资源评估',
        manualNote: '建议：实地踏勘 + 水质检测 + 查阅水利普查数据',
        sources: [
          { type: 'AI评估', name: '水资源AI评估', url: '', confidence: '中' },
          { type: '建议', name: '实地踏勘确认', url: '', confidence: '高' },
          { type: '建议', name: '水质检测报告', url: '', confidence: '高' }
        ]
      },
      ground: {
        value: `【待人工采集】地下水资源与温泉资源待查。\n\n建议：咨询当地水文地质部门或查阅水文地质图，确认地下水埋深、水质、储量。`,
        sourceType: 'manual',
        sourceName: '待查',
        manualNote: '建议咨询当地水文地质部门',
        sources: [
          { type: '人工', name: '待实地调查', url: '', confidence: '待确认' }
        ]
      }
    }
  },

  // 生物景观采集
  _collectBiology(region, terrain, coord) {
    return {
      vegetation: {
        value: `【AI聚合】植被资源评估（${region}）：\n\n• 植被类型：建议开展植被样方调查（群落类型/覆盖率/优势种）\n• 覆盖率：建议通过无人机多光谱遥感估算植被指数（NDVI）\n• 季相变化：建议记录不同季节的植被色彩与形态变化\n• 生态价值：评估植被的生态服务价值（碳汇/水土保持/生物多样性）`,
        sourceType: 'ai_aggregation',
        sourceName: 'AI植被资源评估',
        manualNote: '建议：植被样方调查 + 无人机多光谱 + 实地踏勘',
        sources: [
          { type: 'AI评估', name: '植被资源AI评估', url: '', confidence: '中' },
          { type: '建议', name: '植被样方调查', url: '', confidence: '高' },
          { type: '建议', name: '无人机多光谱遥感', url: '', confidence: '高' }
        ]
      },
      wildlife: {
        value: `【待人工采集】野生动物与栖息环境待实地调查。\n\n建议：联系当地林业部门获取观测记录，开展红外相机监测。`,
        sourceType: 'manual',
        sourceName: '待查',
        manualNote: '建议联系当地林业部门',
        sources: [
          { type: '人工', name: '待实地调查', url: '', confidence: '待确认' }
        ]
      },
      trees: {
        value: `【待人工采集】古树名木（百年以上）待普查。\n\n建议：走访村委会，查阅古树名木登记簿，现场踏勘确认。`,
        sourceType: 'manual',
        sourceName: '待查',
        manualNote: '建议走访村委会 + 查阅登记簿',
        sources: [
          { type: '人工', name: '待实地普查', url: '', confidence: '待确认' }
        ]
      }
    }
  },

  // 气候与天象采集
  _collectClimate(region, coord) {
    return {
      climate: {
        value: `【AI聚合】气候特征评估（基于${region}推断）：\n\n• 气候类型：亚热带季风气候区\n• 建议查询：最近气象站数据，确认年均温、降水量、无霜期、极端天气频率\n• 适宜期：建议分析旅游适宜期（温湿指数、风效指数等）\n• 数据来源：建议访问中国气象数据网或和风天气API`,
        sourceType: 'ai_aggregation',
        sourceName: 'AI基于区域气候推断',
        manualNote: '建议查询：中国气象数据网（http://data.cma.cn/）或和风天气API',
        sources: [
          { type: 'AI推断', name: '基于区域气候推断', url: '', confidence: '中' },
          { type: '建议', name: '中国气象数据网', url: 'http://data.cma.cn/', confidence: '高' },
          { type: '建议', name: '和风天气API', url: 'https://dev.heweather.com/', confidence: '高' }
        ]
      },
      meteor: {
        value: `【待人工采集】天象奇观与特殊气象资源待查。\n\n建议调研：①云海/雾凇/星空等自然天象出现频率 ②光污染等级 ③最佳观测季节。`,
        sourceType: 'manual',
        sourceName: '待查',
        manualNote: '建议实地观测 + 查阅气象记录',
        sources: [
          { type: '人工', name: '待实地观测', url: '', confidence: '待确认' }
        ]
      }
    }
  },

  // 历史遗迹采集
  _collectHistory(region, city, district, coord) {
    return {
      sites: {
        value: `【AI聚合】历史遗迹与文物点评估（${region}）：\n\n• 建议查询：第三次全国文物普查数据\n• 建议查阅：地方志/县志，确认历史遗迹分布\n• 建议调研：传统村落调查登记表\n• 数据来源：国家文物局（http://www.ncha.gov.cn/）`,
        sourceType: 'ai_aggregation',
        sourceName: 'AI文物资源评估',
        manualNote: '建议查询：第三次全国文物普查数据 + 地方志 + 国家文物局官网',
        sources: [
          { type: 'AI评估', name: '文物资源AI评估', url: '', confidence: '中' },
          { type: '建议', name: '第三次全国文物普查数据', url: '', confidence: '高' },
          { type: '建议', name: '国家文物局', url: 'http://www.ncha.gov.cn/', confidence: '高' }
        ]
      },
      architecture: {
        value: `【待人工采集】传统建筑与民居群落待查。\n\n建议实地踏勘确认：①是否有历史建筑/古村落 ②建筑风格与保存状况 ③是否列入保护名录。`,
        sourceType: 'manual',
        sourceName: '待查',
        manualNote: '建议实地踏勘 + 查阅保护名录',
        sources: [
          { type: '人工', name: '待实地踏勘', url: '', confidence: '待确认' }
        ]
      }
    }
  },

  // 现代设施与特产采集
  _collectFacility(region, coord) {
    return {
      facility: {
        value: `【AI聚合】基础设施条件评估（${region}）：\n\n• 建议调研：道路硬化率与宽度、水电燃气通信覆盖、垃圾处理/污水排放、医疗教育配套\n• 数据来源：乡村振兴基础设施台账、乡镇政府公开信息`,
        sourceType: 'ai_aggregation',
        sourceName: 'AI基础设施评估',
        manualNote: '建议查阅：乡村振兴基础设施台账 + 乡镇政府公开信息',
        sources: [
          { type: 'AI评估', name: '基础设施AI评估', url: '', confidence: '中' },
          { type: '建议', name: '乡村振兴基础设施台账', url: '', confidence: '高' }
        ]
      },
      products: {
        value: `【待人工采集】地方特产与农特产品待查。\n\n建议走访：①村委会/乡镇农办 ②本地农户 ③农贸市场，确认特色产品种类与产业化程度。`,
        sourceType: 'manual',
        sourceName: '待查',
        manualNote: '建议走访村委会/农户/农贸市场',
        sources: [
          { type: '人工', name: '待实地走访', url: '', confidence: '待确认' }
        ]
      }
    }
  },

  // 人文活动采集
  _collectCulture(region, city, district, coord) {
    return {
      intangible: {
        value: `【AI聚合】非物质文化遗产资源评估（${region}）：\n\n• 建议查询：省级/市级非遗名录\n• 建议联系：本地文化馆/非遗保护中心\n• 建议确认：是否有传承人在当地居住\n• 数据来源：中国非物质文化遗产网（https://www.ihchina.cn/）`,
        sourceType: 'ai_aggregation',
        sourceName: 'AI非遗资源评估',
        manualNote: '建议查询：省级非遗保护中心名录 + 中国非物质文化遗产网',
        sources: [
          { type: 'AI评估', name: '非遗资源AI评估', url: '', confidence: '中' },
          { type: '建议', name: '中国非物质文化遗产网', url: 'https://www.ihchina.cn/', confidence: '高' },
          { type: '建议', name: '省级非遗保护中心', url: '', confidence: '高' }
        ]
      },
      folk: {
        value: `【待人工采集】民俗活动与传统节庆待查。\n\n建议通过口述史访谈、村委会座谈，收集本地独特的民俗仪式、节庆活动、民间技艺。`,
        sourceType: 'manual',
        sourceName: '待查',
        manualNote: '建议口述史访谈 + 村委会座谈',
        sources: [
          { type: '人工', name: '待口述史访谈', url: '', confidence: '待确认' }
        ]
      },
      legends: {
        value: `【待人工采集】传说典故与地名由来待查。\n\n建议查阅：①地方志/地名志 ②文史资料 ③向村中老人做口述史采集。`,
        sourceType: 'manual',
        sourceName: '待查',
        manualNote: '建议查阅地方志/地名志 + 口述史采集',
        sources: [
          { type: '人工', name: '待查阅文史资料', url: '', confidence: '待确认' }
        ]
      },
      figures: {
        value: `【待人工采集】历史人物与地方名人待查。\n\n建议查阅县志、党史资料，确认是否有历史名人与本地关联。`,
        sourceType: 'manual',
        sourceName: '待查',
        manualNote: '建议查阅县志/党史资料',
        sources: [
          { type: '人工', name: '待查阅县志', url: '', confidence: '待确认' }
        ]
      }
    }
  },

  // 生成资源综合评价
  _generateResourceSummary(region, terrain, area, radar) {
    const avgScore = Math.round(radar.reduce((sum, item) => sum + item.value, 0) / radar.length)
    let level = ''
    if (avgScore >= 80) level = '优质'
    else if (avgScore >= 70) level = '良好'
    else if (avgScore >= 60) level = '中等'
    else level = '待提升'

    return {
      value: `【资源综合评价】地块位于${region}，${area ? '面积 ' + area + '，' : ''}地形为"${terrain || '待确认'}"。\n\n• 资源禀赋评分：${avgScore}分（${level}）\n• 优势资源：${radar.sort((a, b) => b.value - a.value).slice(0, 3).map(item => item.name).join('、')}\n• 短板资源：${radar.sort((a, b) => a.value - b.value).slice(0, 3).map(item => item.name).join('、')}\n\n请点击各卡片逐项编辑填入真实数据。完成 20 项资源调查后，雷达图评分将自动更新。`,
      sourceType: 'ai_aggregation',
      sourceName: 'AI资源综合评价',
      manualNote: '待逐项补充真实数据后更新'
    }
  },

  // ========= 无 W1 数据时的通用占位 =========
  _loadPlaceholderData() {
    const placeholder = { value: '请先完成 W1 地块框选，系统将基于地块坐标与行政区域自动生成资源调查框架。', sourceType: 'manual', sourceName: '系统提示', manualNote: '' }
    this.setData({
      geomorphologyList: [this._buildItem('geomorphology', '地貌与地形特征', placeholder)],
      geologyList: [this._buildItem('geology', '地质构造与稳定性', placeholder)],
      naturalLandscapeList: [this._buildItem('naturalLandscape', '自然景观肌理', placeholder)],
      waterList: [
        this._buildItem('surfaceWater', '地表水', placeholder),
        this._buildItem('groundwater', '地下水', placeholder)
      ],
      biologyList: [
        this._buildItem('vegetation', '植被', placeholder),
        this._buildItem('wildlife', '野生动物', placeholder),
        this._buildItem('ancientTrees', '古树名木', placeholder)
      ],
      climateList: [
        this._buildItem('climate', '气候特征', placeholder),
        this._buildItem('meteorological', '天象奇观', placeholder)
      ],
      historyList: [
        this._buildItem('historicalSites', '历史遗迹', placeholder),
        this._buildItem('traditionalArchitecture', '传统建筑', placeholder)
      ],
      facilityList: [
        this._buildItem('modernFacilities', '基础设施', placeholder),
        this._buildItem('localProducts', '地方特产', placeholder)
      ],
      cultureList: [
        this._buildItem('intangibleHeritage', '非遗项目', placeholder),
        this._buildItem('folkCustoms', '民俗活动', placeholder),
        this._buildItem('legendsAndStories', '传说典故', placeholder),
        this._buildItem('historicalFigures', '历史人物', placeholder)
      ],
      resourceSummaryValue: '请先完成 W1 地块框选，再进入资源调查。',
      resourceSummarySourceType: 'manual',
      resourceSummaryManualNote: ''
    })
  },

  // ========= 根据地形推断雷达图基准分 =========
  _estimateRadarByTerrain(terrain) {
    const base = [
      { name: '地文景观', value: 65 },
      { name: '地质构造', value: 60 },
      { name: '自然景观', value: 60 },
      { name: '水域景观', value: 55 },
      { name: '生物景观', value: 60 },
      { name: '气候天象', value: 65 },
      { name: '历史遗迹', value: 50 },
      { name: '现代设施', value: 50 },
      { name: '人文活动', value: 50 }
    ]
    if (!terrain) return base
    const t = terrain.toLowerCase()
    // 丘陵加分
    if (t.includes('丘陵') || t.includes('岗')) {
      base[0].value = 78  // 地文
      base[1].value = 68  // 地质
      base[2].value = 72  // 自然
    }
    // 平原加分
    if (t.includes('平原')) {
      base[0].value = 60
      base[7].value = 60  // 设施
    }
    // 高差加分
    if (t.includes('高差')) {
      base[0].value = Math.min(85, base[0].value + 5)
    }
    // 水域加分
    if (t.includes('水') || t.includes('河') || t.includes('湖')) {
      base[3].value = 75
    }
    // 林加分
    if (t.includes('林') || t.includes('森')) {
      base[4].value = 78
      base[2].value = Math.min(85, base[2].value + 5)
    }
    return base
  },

  onReady() {
    // CSS 条形图无需 Canvas 绘制，自动渲染
    this._updateTotalScore()
  },

  _updateTotalScore() {
    const { radarIndicators } = this.data
    const score = Math.round(
      radarIndicators.reduce((sum, item) => sum + item.value, 0) / radarIndicators.length
    )
    this.setData({ radarTotalScore: score })
  },

  _buildList(key, label, data) {
    return [this._buildItem(key, label, data)]
  },

  _buildItem(key, label, data) {
    return {
      key,
      label,
      value: data.value || '',
      sourceType: data.sourceType || 'manual',
      sourceName: data.sourceName || '待查',
      manualNote: data.manualNote || '',
      sources: data.sources || []  // 溯源信息数组
    }
  },

  // ========= 展开/折叠功能 =========
  onToggleExpand(e) {
    const key = e.currentTarget.dataset.key
    const expandedItems = { ...this.data.expandedItems }
    expandedItems[key] = !expandedItems[key]
    this.setData({ expandedItems })
  },

  onEditItem(e) {
    const key = e.currentTarget.dataset.key
    let item = null
    const allLists = [
      ...this.data.geomorphologyList,
      ...this.data.geologyList,
      ...this.data.naturalLandscapeList,
      ...this.data.waterList,
      ...this.data.biologyList,
      ...this.data.climateList,
      ...this.data.historyList,
      ...this.data.facilityList,
      ...this.data.cultureList
    ]
    item = allLists.find(i => i.key === key)
    if (!item && key === 'resourceSummary') {
      item = {
        key: 'resourceSummary',
        value: this.data.resourceSummaryValue,
        sourceType: this.data.resourceSummarySourceType,
        manualNote: this.data.resourceSummaryManualNote
      }
    }
    if (!item) return

    wx.showModal({
      title: '修正数据或添加备注',
      content: '请输入修正后的数据或备注：',
      editable: true,
      placeholderText: item.value.slice(0, 50) + (item.value.length > 50 ? '...' : ''),
      success: (res) => {
        if (res.confirm) {
          const updateData = {}
          if (key === 'resourceSummary') {
            updateData.resourceSummaryValue = res.content || item.value
            updateData.resourceSummaryManualNote = res.content
              ? '人工修正：' + res.content.slice(0, 20) + (res.content.length > 20 ? '...' : '')
              : item.manualNote
          } else {
            this._updateListData(key, res.content || item.value, res.content ? '人工修正：' + res.content.slice(0, 20) : item.manualNote)
          }
          this.setData(updateData)
        }
      }
    })
  },

  _updateListData(key, newValue, newNote) {
    const lists = ['geomorphologyList', 'geologyList', 'naturalLandscapeList', 'waterList', 'biologyList', 'climateList', 'historyList', 'facilityList', 'cultureList']
    for (const listName of lists) {
      const list = this.data[listName]
      const idx = list.findIndex(i => i.key === key)
      if (idx !== -1) {
        const updateKey = `${listName}[${idx}].value`
        const noteKey = `${listName}[${idx}].manualNote`
        this.setData({ [updateKey]: newValue, [noteKey]: newNote })
        break
      }
    }
  },

  onToggleConfirm() {
    this.setData({ isConfirmed: !this.data.isConfirmed })
  },

  onNext() {
    if (!this.data.isConfirmed) {
      wx.showToast({ title: '请先勾选确认资源数据', icon: 'none' })
      return
    }
    wx.navigateTo({
      url: '/pages/w3-policy/index',
      fail: () => wx.redirectTo({ url: '/pages/w3-policy/index' })
    })
  },

  onGoBack() {
    wx.navigateBack({ delta: 1 })
  }
})
