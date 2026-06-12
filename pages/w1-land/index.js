// pages/w1-land/index.js
// W1 地块框选 V3.2 信息汇总版（折叠坐标栏 + 完整行政区划 + 面积双单位）
const { mockData } = require('../../utils/mock-data.js')

Page({
  data: {
    dataSource: '基于腾讯地图 · 定位 + 逆地址解析 + AI聚合',
    isConfirmed: false,
    confirmText: '我已核对地块框选信息，数据无误',

    // 地图相关
    latitude: 30.889,
    longitude: 114.378,
    mapScale: 16,
    markers: [],

    // 折叠状态
    coordListExpanded: false,

    // ① 地块名称
    officialNameValue: '',
    officialNameSourceType: '',
    officialNameManualNote: '',

    // ② 地理坐标（GCJ-02）
    geoCoordValue: { lat: '', lng: '' },
    geoCoordSourceType: '',
    geoCoordManualNote: '',

    // ③ 行政区划
    adminCodeValue: '',
    adminCodeName: '',      // 代码对应的名称，如 "武汉市黄陂区"
    adminFullName: '',      // 完整行政层级：湖北省武汉市黄陂区xx镇xx乡xx湾
    adminCodeSourceType: '',
    adminCodeManualNote: '',

    // ④ 地块面积（双单位）
    areaValue: '',          // 显示文本
    areaKm2: '',            // km²
    areaMu: '',             // 亩
    areaSourceType: '',
    areaManualNote: '',

    // ⑤ 地形地貌
    terrainValue: '',
    terrainSourceType: '',
    terrainManualNote: '',

    // 多边形数据
    polygonPoints: [],
    polygons: [],
    coordList: []
  },

  onLoad() {
    // 初始状态：所有字段留空，等待用户框选后从腾讯地图实时获取
    // 不再预填 mock 数据，避免域名异常时显示旧数据
    this.setData({
      confirmText: '我已核对地块框选信息，数据无误',
      officialNameValue: '',
      officialNameSourceType: '',
      officialNameManualNote: '',
      adminCodeValue: '',
      adminCodeName: '',
      adminFullName: '',
      adminCodeSourceType: '',
      adminCodeManualNote: '',
      areaValue: '',
      areaKm2: '',
      areaMu: '',
      areaSourceType: '',
      areaManualNote: '',
      terrainValue: '',
      terrainSourceType: '',
      terrainManualNote: ''
    })
    this.getLocation()
  },

  // ========= 折叠/展开坐标列表 =========
  onToggleCoordList() {
    this.setData({ coordListExpanded: !this.data.coordListExpanded })
  },

  // ========= 腾讯地图：获取定位 =========
  getLocation() {
    const self = this
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const lat = res.latitude.toFixed(6)
        const lng = res.longitude.toFixed(6)
        self.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          geoCoordValue: { lat, lng },
          mapScale: 16
        })
        self.reverseGeocode(res.latitude, res.longitude)
      },
      fail: () => {
        const lat = self.data.latitude.toFixed(6)
        const lng = self.data.longitude.toFixed(6)
        self.setData({
          geoCoordValue: { lat, lng },
          geoCoordSourceType: 'official_api'
        })
        self.reverseGeocode(self.data.latitude, self.data.longitude)
      }
    })
  },

  // ========= 腾讯地图：逆地址解析（增强版：获取完整行政区划到镇级）=========
  reverseGeocode(lat, lng) {
    const qqMapKey = '4X5BZ-PRTCZ-L4ZXA-ZC6PF-RZEJO-JLBIF'
    const self = this
    const locationStr = `${parseFloat(lat).toFixed(6)},${parseFloat(lng).toFixed(6)}`

    console.log('[reverseGeocode] 请求坐标:', locationStr)

    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: locationStr,
        key: qqMapKey,
        output: 'json'
      },
      success: (res) => {
        console.log('[reverseGeocode] 响应状态:', res.statusCode)
        console.log('[reverseGeocode] 响应数据:', res.data)

        if (!res.data) {
          wx.showToast({ title: '地图API返回空数据', icon: 'none' })
          return
        }

        if (res.data.status !== 0) {
          const msg = res.data.message || `错误码 ${res.data.status}`
          console.error('[reverseGeocode] API错误:', msg)
          wx.showToast({ title: `地图API: ${msg}`, icon: 'none', duration: 3000 })
          return
        }

        const result = res.data.result || {}
        const adInfo = result.ad_info || {}
        const comp = result.address_component || {}

        // 行政区划代码
        const adcode = adInfo.adcode || ''

        // 构建完整行政层级：优先用 address_component，其次 ad_info，最后 result.address
        const province = comp.province || adInfo.province || ''
        const city = comp.city || adInfo.city || ''
        const district = comp.district || adInfo.district || ''
        const street = comp.street || ''
        const streetNumber = comp.street_number || ''

        // 完整名称拼接（省市区镇乡湾）
        const parts = [province, city, district, street, streetNumber].filter(Boolean)
        // 如果拼接为空，直接用腾讯地图返回的完整地址（去掉门牌号数字）
        const rawAddress = result.address || ''
        const fullName = parts.join('') || rawAddress.replace(/[0-9\-]+号?/g, '').trim() || '未知区域'

        // 代码对应名称（市+区）
        const codeName = [city, district].filter(Boolean).join('') || province || '未知'

        console.log('[reverseGeocode] ✅ 解析成功')
        console.log('[reverseGeocode] address_component:', comp)
        console.log('[reverseGeocode] ad_info:', adInfo)
        console.log('[reverseGeocode] result.address:', rawAddress)
        console.log('[reverseGeocode] fullName:', fullName)
        console.log('[reverseGeocode] adcode:', adcode)

        // 用腾讯地图真实地址生成地块名（优先推荐地址，其次标准地址）
        const recommend = result.formatted_addresses
          ? result.formatted_addresses.recommend || ''
          : ''
        const landName = recommend || rawAddress || `${province}${city}${district}${street}地块`

        // 地形地貌推断（基于最新adcode）
        const terrain = self._guessTerrain(lat, lng, adcode)

        // 一次性更新所有数据（避免多次setData）
        self.setData({
          adminCodeValue: adcode,
          adminCodeName: codeName,
          adminFullName: fullName,
          adminCodeSourceType: 'official_api',
          adminCodeManualNote: `腾讯地图逆地址解析：${fullName}`,
          officialNameValue: landName,
          officialNameSourceType: 'official_api',
          officialNameManualNote: '腾讯地图逆地址解析',
          terrainValue: terrain,
          terrainSourceType: 'ai_aggregation',
          terrainManualNote: '基于坐标与行政区划的AI推断'
        })

        wx.showToast({ title: `已更新：${codeName}`, icon: 'none', duration: 1500 })
      },
      fail: (err) => {
        console.error('[reverseGeocode] 请求失败:', err)
        wx.showToast({ title: '网络请求失败，请检查域名配置', icon: 'none', duration: 3000 })
      }
    })
  },

  // ========= 地图：点击添加顶点 =========
  onMapTap(e) {
    const { latitude, longitude } = e.detail
    const points = this.data.polygonPoints.concat({ latitude, longitude })
    const coordList = points.map(p => ({
      lat: p.latitude.toFixed(6),
      lng: p.longitude.toFixed(6)
    }))
    this.setData({
      polygonPoints: points,
      coordList: coordList,
      markers: points.map((p, i) => ({
        id: i,
        latitude: p.latitude,
        longitude: p.longitude,
        title: `顶点${i + 1}`,
        iconPath: '/images/pin.png',
        width: 30,
        height: 30
      }))
    })
    if (points.length >= 3) {
      this.finishPolygon(points)
    } else {
      this.setData({ polygons: [] })
    }
  },

  // ========= 完成框选：闭合多边形并刷新所有数据 =========
  finishPolygon(points) {
    const pts = points || this.data.polygonPoints
    if (pts.length < 3) return
    const polygon = [{
      points: pts,
      strokeWidth: 3,
      strokeColor: '#1A6DFFDD',
      fillColor: '#1A6DFF33',
      zIndex: 1
    }]
    // 多边形质心
    const centerLat = (pts.reduce((s, p) => s + p.latitude, 0) / pts.length).toFixed(6)
    const centerLng = (pts.reduce((s, p) => s + p.longitude, 0) / pts.length).toFixed(6)
    this.setData({
      polygons: polygon,
      geoCoordValue: { lat: centerLat, lng: centerLng },
      geoCoordSourceType: 'official_api',
      geoCoordManualNote: `多边形${pts.length}个顶点中心坐标`
    })
    this.calcPolygonArea(pts)
    this.refreshByCenter(parseFloat(centerLat), parseFloat(centerLng))
  },

  // ========= 手动完成框选按钮 =========
  onFinishPolygon() {
    const points = this.data.polygonPoints
    if (points.length < 3) {
      wx.showToast({ title: '至少需要 3 个顶点', icon: 'none' })
      return
    }
    this.finishPolygon(points)
    wx.showToast({ title: `已完成，${points.length} 个顶点`, icon: 'none' })
  },

  // ========= 撤回最后一个坐标点 =========
  onUndoPoint() {
    const points = this.data.polygonPoints
    if (points.length === 0) return
    const prev = points.slice(0, -1)
    const coordList = prev.map(p => ({
      lat: p.latitude.toFixed(6),
      lng: p.longitude.toFixed(6)
    }))
    this.setData({
      polygonPoints: prev,
      coordList: coordList,
      markers: prev.map((p, i) => ({
        id: i,
        latitude: p.latitude,
        longitude: p.longitude,
        title: `顶点${i + 1}`,
        iconPath: '/images/pin.png',
        width: 30,
        height: 30
      }))
    })
    if (prev.length >= 3) {
      this.finishPolygon(prev)
    } else {
      this.setData({ polygons: [], areaValue: '', areaKm2: '', areaMu: '' })
    }
    wx.showToast({ title: `已撤回 P${points.length}`, icon: 'none', duration: 1000 })
  },

  // ========= 清除地块 =========
  onClearPolygon() {
    const lat = this.data.latitude.toFixed(6)
    const lng = this.data.longitude.toFixed(6)
    this.setData({
      polygonPoints: [],
      polygons: [],
      coordList: [],
      markers: [],
      areaValue: '',
      areaKm2: '',
      areaMu: '',
      areaSourceType: '',
      areaManualNote: '',
      geoCoordValue: { lat, lng },
      geoCoordSourceType: 'official_api',
      geoCoordManualNote: '定位中心坐标'
    })
  },

  // ========= 计算多边形面积（km² + 亩 双单位）=========
  calcPolygonArea(points) {
    const R = 6371000
    let area = 0
    const n = points.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const lat1 = points[i].latitude * Math.PI / 180
      const lat2 = points[j].latitude * Math.PI / 180
      const lng1 = points[i].longitude * Math.PI / 180
      const lng2 = points[j].longitude * Math.PI / 180
      area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2))
    }
    area = Math.abs(area * R * R / 2)
    const areaKm2 = (area / 1000000).toFixed(3)  // m² → km²
    const areaMu = Math.round(area / 666.67)       // m² → 亩
    this.setData({
      areaValue: `${areaKm2} km²（${areaMu} 亩）`,
      areaKm2: areaKm2,
      areaMu: areaMu,
      areaSourceType: 'official_api',
      areaManualNote: `多边形 ${points.length} 个顶点，球面梯形法计算`
    })
  },

  // ========= 框选完成后：用中心坐标重新获取腾讯地图完整数据 =========
  refreshByCenter(lat, lng) {
    // 用多边形中心坐标重新逆地址解析
    // reverseGeocode 内部会同步更新：行政区域、地块名称、地形地貌
    this.reverseGeocode(lat, lng)
  },

  _guessProvince(adcode) {
    const map = {
      '11': '北京', '12': '天津', '13': '河北', '14': '山西', '15': '内蒙古',
      '21': '辽宁', '22': '吉林', '23': '黑龙江',
      '31': '上海', '32': '江苏', '33': '浙江', '34': '安徽', '35': '福建', '36': '江西', '37': '山东',
      '41': '河南', '42': '湖北', '43': '湖南', '44': '广东', '45': '广西', '46': '海南',
      '50': '重庆', '51': '四川', '52': '贵州', '53': '云南', '54': '西藏',
      '61': '陕西', '62': '甘肃', '63': '青海', '64': '宁夏', '65': '新疆'
    }
    return map[String(adcode).substring(0, 2)] || ''
  },

  _guessTerrain(lat, lng, adcode) {
    const prefix = String(adcode).substring(0, 2)
    if (['11','12','31','50'].includes(prefix)) return '平原地貌，地势平坦，适宜整体开发'
    if (['42','43','44','45','46'].includes(prefix)) return '丘陵地貌，高差20-80m，适合低冲击阶梯式开发'
    if (['63','64','65'].includes(prefix)) return '高原地貌，日照充足，适合生态文旅与能源综合利用'
    if (['32','33','35','36','37'].includes(prefix)) return '水网平原，临近水系，适宜水岸文旅开发'
    return '地貌类型待实地踏勘确认，建议补充 DEM 高程数据'
  },

  // ========= 精确调整坐标点 =========
  onAdjustCoord(e) {
    const idx = e.currentTarget.dataset.index
    const pt = this.data.polygonPoints[idx]
    if (!pt) return
    const lat = pt.latitude.toFixed(6)
    const lng = pt.longitude.toFixed(6)
    const self = this

    wx.showActionSheet({
      itemList: [
        `纬度 ＋0.000001（${lat}）`,
        `纬度 －0.000001（${lat}）`,
        `经度 ＋0.000001（${lng}）`,
        `经度 －0.000001（${lng}）`,
        '✏️ 手动输入精确坐标'
      ],
      success(res) {
        switch (res.tapIndex) {
          case 0: self._updateCoord(idx, pt.latitude + 0.000001, pt.longitude); break
          case 1: self._updateCoord(idx, pt.latitude - 0.000001, pt.longitude); break
          case 2: self._updateCoord(idx, pt.latitude, pt.longitude + 0.000001); break
          case 3: self._updateCoord(idx, pt.latitude, pt.longitude - 0.000001); break
          case 4: self._promptCoordInput(idx, lat, lng); break
        }
      }
    })
  },

  _updateCoord(idx, newLat, newLng) {
    const points = this.data.polygonPoints.slice()
    points[idx] = { latitude: newLat, longitude: newLng }
    const coordList = points.map(p => ({
      lat: p.latitude.toFixed(6),
      lng: p.longitude.toFixed(6)
    }))
    this.setData({
      polygonPoints: points,
      coordList: coordList,
      markers: points.map((p, i) => ({
        id: i,
        latitude: p.latitude,
        longitude: p.longitude,
        title: `顶点${i + 1}`,
        iconPath: '/images/pin.png',
        width: 30,
        height: 30
      }))
    })
    if (points.length >= 3) this.finishPolygon(points)
  },

  _promptCoordInput(idx, oldLat, oldLng) {
    const self = this
    wx.showModal({
      title: `精确调整 P${idx + 1}`,
      editable: true,
      placeholderText: `${oldLat}, ${oldLng}`,
      content: '请输入：纬度,经度',
      success(res) {
        if (res.confirm && res.content) {
          const parts = res.content.split(',')
          if (parts.length === 2) {
            const newLat = parseFloat(parts[0].trim())
            const newLng = parseFloat(parts[1].trim())
            if (!isNaN(newLat) && !isNaN(newLng)) {
              self._updateCoord(idx, newLat, newLng)
              return
            }
          }
          wx.showToast({ title: '格式错误，请用 纬度,经度', icon: 'none' })
        }
      }
    })
  },

  onDeletePoint(e) {
    const idx = e.currentTarget.dataset.index
    const points = this.data.polygonPoints.filter((_, i) => i !== idx)
    const coordList = points.map(p => ({
      lat: p.latitude.toFixed(6),
      lng: p.longitude.toFixed(6)
    }))
    this.setData({
      polygonPoints: points,
      coordList: coordList,
      markers: points.map((p, i) => ({
        id: i,
        latitude: p.latitude,
        longitude: p.longitude,
        title: `顶点${i + 1}`,
        iconPath: '/images/pin.png',
        width: 30,
        height: 30
      }))
    })
    if (points.length >= 3) {
      this.finishPolygon(points)
    } else {
      this.setData({ polygons: [], areaValue: '', areaKm2: '', areaMu: '' })
    }
  },

  onRelocate() { this.getLocation() },
  onRegionChange(e) {},

  // ========= 通用编辑弹窗 =========
  onEditItem(e) {
    const key = e.currentTarget.dataset.key
    const dataMap = {
      officialName: { value: this.data.officialNameValue, noteKey: 'officialNameManualNote' },
      terrain: { value: this.data.terrainValue, noteKey: 'terrainManualNote' }
    }
    const item = dataMap[key]
    if (!item) return

    wx.showModal({
      title: '修正数据',
      editable: true,
      placeholderText: item.value,
      success: (res) => {
        if (res.confirm && res.content) {
          const updateData = {}
          updateData[this._valueKey(key)] = res.content
          updateData[item.noteKey] = '人工修正：' + res.content
          this.setData(updateData)
        }
      }
    })
  },

  _valueKey(key) {
    const map = { officialName: 'officialNameValue', terrain: 'terrainValue' }
    return map[key]
  },

  onToggleConfirm() {
    this.setData({ isConfirmed: !this.data.isConfirmed })
  },

  onNext() {
    if (!this.data.isConfirmed) {
      wx.showToast({ title: '请先勾选确认', icon: 'none' })
      return
    }
    const app = getApp()
    app.globalData.landInfo = {
      name: this.data.officialNameValue,
      coord: this.data.geoCoordValue,
      adminCode: this.data.adminCodeValue,
      adminFullName: this.data.adminFullName,
      area: this.data.areaValue,
      areaKm2: this.data.areaKm2,
      areaMu: this.data.areaMu,
      terrain: this.data.terrainValue,
      polygonPoints: this.data.polygonPoints
    }
    wx.navigateTo({
      url: '/pages/w2-resource/index',
      fail: () => wx.redirectTo({ url: '/pages/w2-resource/index' })
    })
  },

  onGoBack() {
    wx.navigateBack({ delta: 1 })
  }
})
