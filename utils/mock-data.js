/**
 * utils/mock-data.js
 * V2.8 全量预埋 + 接口预留版
 * 
 * 数据结构规范：
 *   每个数据项 = { value, sourceType, sourceName, manualNote }
 *   sourceType: 'official_api' | 'ai_aggregation' | 'manual'
 * 
 * 接口预留：fetchSource.official(endpoint) / fetchSource.ai(query)
 * 未来接入真实 API 时，只需修改 utils/fetcher.js
 */

const mockData = {
  // ============================================================
  // S1-S2：启动与指南
  // ============================================================
  s1_cover: {
    title:       { value: '踏歌行智策通', sourceType: 'manual', sourceName: '系统固定', manualNote: '' },
    subtitle:    { value: '文旅项目全周期决策辅助智能体矩阵 · 定位决策好助手', sourceType: 'manual', sourceName: '系统固定', manualNote: '' }
  },

  s2_guide: {
    dataRule: {
      value: '数据优先级规则：1. 官方API > 2. AI聚合 > 3. 人工修正',
      sourceType: 'manual',
      sourceName: '系统规则',
      manualNote: ''
    }
  },

  // ============================================================
  // W1：身份认证
  // ============================================================
  w1_auth: {
    projectId: { value: 'PROJ-2025-HB-001', sourceType: 'official_api', sourceName: '项目管理系统', manualNote: '' }
  },

  // ============================================================
  // W1：地块框选（锚点）
  // V3.0 腾讯地图接入版
  // ============================================================
  w1_land: {
    geoCoord: {
      value: { lat: '30.889000', lng: '114.378000' },
      sourceType: 'official_api',
      sourceName: '天地图·地名地址API',
      manualNote: ''
    },
    adminCode: { value: '420116', sourceType: 'official_api', sourceName: '民政部行政区划代码', manualNote: '' },
    officialName: {
      value: '武汉市黄陂区前川街道定远村地块',
      sourceType: 'official_api',
      sourceName: '自然资源局地块编号系统',
      manualNote: ''
    },
    area: { value: '框选后自动计算', sourceType: '', sourceName: '', manualNote: '' },
    terrain: {
      value: '城郊缓丘岗地，高差约 15–40m，适合低冲击开发',
      sourceType: 'ai_aggregation',
      sourceName: 'DEM数字高程模型 + 实地踏勘',
      manualNote: '最高点约 +85m（村北岗顶），最低点约 +45m（村南水塘）'
    }
  },

  // ============================================================
  // W3：资源调查（GB/T 18972-2017 全量版 · 20项）
  // ============================================================
  w3_resource: {
    // --- 地文景观 ---
    geomorphology: {
      value: '岗丘地貌：海拔45-85m，坡度5°-25°，整体呈南北高差约40m的缓丘格局；基岩为砂页岩，土层厚度中等（0.5-1.2m），适宜低强度开发。',
      sourceType: 'official_api',
      sourceName: '国土空间规划"一张图"·地形栅格数据',
      manualNote: '建议建筑布局避开坡度>25°区域'
    },
    geology: {
      value: '砂页岩基岩，无活动断层；区域地震烈度Ⅵ度区，建筑按Ⅶ度设防；无采空区、无岩溶塌陷风险。',
      sourceType: 'official_api',
      sourceName: '湖北省地质环境信息平台',
      manualNote: ''
    },
    naturalLandscape: {
      value: '岗丘—林—田—塘复合肌理：村北为马尾松+油茶混交林，村中为梯田茶田（约120亩），村南为连片塘堰（约80亩），形成"林—田—水"立体景观格局。',
      sourceType: 'ai_aggregation',
      sourceName: '卫星影像解译 + 实地航拍',
      manualNote: '春季油菜花田景观极佳，可打造为摄影打卡点'
    },

    // --- 水域景观 ---
    surfaceWater: {
      value: '地表水体：村南连片塘堰约80亩，水质Ⅲ类（2024年区环保局监测数据）；村东有灌溉斗渠1条（宽约3m，季节性流水）；无天然河流穿过地块。',
      sourceType: 'ai_aggregation',
      sourceName: '黄陂区生态环境局·水质月报 + 实地采样',
      manualNote: '塘堰可改造为景观水面，需做防渗和生态治理'
    },
    groundwater: {
      value: '地下水位较深（勘察钻孔显示静水位埋深8-12m），无温泉资源；地下水类型为孔隙潜水，不宜作为饮用水水源。',
      sourceType: 'official_api',
      sourceName: '湖北省水文地质信息网',
      manualNote: ''
    },

    // --- 生物景观 ---
    vegetation: {
      value: '植被覆盖率>60%：主要群落为马尾松—油茶混交林（村北）、毛竹纯林（村西北）、茶树梯田（村中）；有少量枫香、樟树散生；草本层以铁芒萁、狗尾草为主。',
      sourceType: 'ai_aggregation',
      sourceName: '实地植被样方调查 + 无人机多光谱',
      manualNote: '油茶林面积约200亩，有经济开发潜力'
    },
    wildlife: {
      value: '白鹭等候鸟栖息地（塘堰周边）；常见小型哺乳动物：野兔、刺猬、鼬獾；昆虫多样性高，夏季萤火虫可见（村南水塘周边）；无国家重点保护野生动物分布。',
      sourceType: 'ai_aggregation',
      sourceName: '黄陂区林业局·野生动物观测记录 + OTA游记关键词提取',
      manualNote: '萤火虫栖息地可作为生态研学卖点'
    },
    ancientTrees: {
      value: '百年以上古茶树约30株（集中在村中茶园区域），最大胸径约45cm；另有古樟树2株（树龄约150年，位于村口）；古银杏1株（村西寺庙遗址旁）。',
      sourceType: 'manual',
      sourceName: '定远村村委会·古树名木登记簿',
      manualNote: '古茶树群落具有独特IP价值，建议申报古树名木保护点'
    },
    ecosystem: {
      value: '亚热带常绿阔叶林生态系统，生物多样性中等；生态敏感性：塘堰湿地>油茶林>梯田>岗顶；无珍稀濒危植物分布；生态承载力评估：日均游客上限约2000人。',
      sourceType: 'official_api',
      sourceName: '湖北省生态系统服务价值评估报报（2023）',
      manualNote: ''
    },

    // --- 气候与天象 ---
    climate: {
      value: '亚热带季风气候：年均气温16.5℃，最热月（7月）均温28.7℃，最冷月（1月）均温3.2℃；无霜期约240天；年降水量约1200mm，集中于6-7月（梅雨季）。',
      sourceType: 'official_api',
      sourceName: '中国气象数据网·黄陂国家气象站（1971-2020）',
      manualNote: '适宜户外研学活动天数约220天/年'
    },
    meteorological: {
      value: '天象奇观：春季雨雾景观（3-4月，云雾缭绕岗丘），秋季云海（10-11月，能见度<500m时可见）；冬季偶见雾凇（极端低温年份）；夏季星空观测条件良好（光污染等级Bortle 4级）。',
      sourceType: 'ai_aggregation',
      sourceName: '天文爱好者社区 + 黄陂区气象站历史观测',
      manualNote: '星空营地有潜力，需做暗夜保护规划'
    },

    // --- 历史遗迹 ---
    historicalSites: {
      value: '清代古民居3处（村中心，硬山搁檩式，青砖黛瓦，保存状况一般）；古驿道遗址1段（村北，碎石铺就，长约200m，为清代汉黄古道支线）；古井1口（村口，青石井圈，仍可使用）。',
      sourceType: 'official_api',
      sourceName: '第三次全国文物普查·湖北卷（黄陂区）',
      manualNote: '古驿道可做文化IP，建议与"茶马古道"文化关联'
    },
    traditionalArchitecture: {
      value: '定远村传统民居约50栋，以"一明两暗"三开间为主，部分带天井；建筑材质：青砖墙基+土坯墙体+小青瓦屋面；典型鄂东民居特征；现状保存：约30%完好，40%需修缮，30%已成危房。',
      sourceType: 'official_api',
      sourceName: '湖北省传统村落调查登记表（2022）',
      manualNote: '可选取3-5栋典型民居做修缮示范，打造"民宿聚落"'
    },

    // --- 现代设施 ---
    modernFacilities: {
      value: '通村公路硬化率100%（村道宽4-5m，会车不便）；5G信号全覆盖（移动/电信均达标）；电力供应充足（村级变压器容量200kVA）；自来水入户率100%（前川水厂供水）；无天然气管道，能源以电和液化气为主；生活垃圾集中收运（每日清运至区垃圾焚烧厂）。',
      sourceType: 'official_api',
      sourceName: '黄陂区乡村振兴基础设施台账（2024）',
      manualNote: '建议引入分布式光伏，降低运营用电成本'
    },
    localProducts: {
      value: '定远绿茶（村集体茶场出品，无品牌包装）、野生蜂蜜（村民散养，无SC认证）、农家腊味（冬季自制，有口碑无品牌）、油茶籽油（初榨，未精炼）；均具备产品化潜力，但缺乏品牌和渠道。',
      sourceType: 'official_api',
      sourceName: '黄陂区农业农村局·特色农产品名录',
      manualNote: '建议引入SC认证和品牌包装设计，可做研学手作体验'
    },

    // --- 人文活动 ---
    intangibleHeritage: {
      value: '黄陂民间彩词（省级非遗，定远村有传承人2名）；黄陂木兰传说（国家级非遗，与定远村"仙女撒茶籽"传说可关联）；武汉采茶戏（市级非遗，村内老年剧团1个）。',
      sourceType: 'official_api',
      sourceName: '湖北省非物质文化遗产保护中心·项目名录',
      manualNote: '彩词传承人高龄（72岁），建议尽快做数字化记录'
    },
    folkCustoms: {
      value: '春节"玩龙灯"（正月初五至十五，全村巡游）；中秋"拜月"（八月十五夜，村口古樟树下设供桌）；清明"采茶歌"（茶山对唱，现存歌词17首）；冬至"打年糕"（全村集体活动，有商业化潜力）。',
      sourceType: 'manual',
      sourceName: '定远村村委会·民俗活动记录（口述史整理）',
      manualNote: '"拜月"仪式可打造为秋季文旅IP活动'
    },
    legendsAndStories: {
      value: '"仙女撒茶籽"传说（唐代仙女途经定远，撒茶籽化作茶园，现存"仙女坡"地名）；岳飞抗金故事（村北古驿道为岳飞北伐途经地，有"点将台"遗址）；张体学游击战故事（1946年，张体学率部在定远村休整）。',
      sourceType: 'ai_aggregation',
      sourceName: '黄陂地名志（1986）+ 黄陂文史资料（第12辑）',
      manualNote: '传说可串联为"定远三故事"文化动线'
    },
    historicalFigures: {
      value: '明代进士李某（佚名，明万历年间进士，设馆讲学于定远村，现存"半山书院"遗址石刻）；近代革命人士张某（名佚，1940年代在定远开展地下工作，无详细记载）。',
      sourceType: 'official_api',
      sourceName: '黄陂县志（清光绪版）+ 中共黄陂党史资料',
      manualNote: '"半山书院"遗址石刻已风化，建议做拓片保护'
    },

    // --- 资源综合评价（人工汇总）---
    resourceSummary: {
      value: '【资源综合评价】自然生态基底优良（林—田—水复合肌理，覆盖率>60%）；文化资源碎片化（有非遗、传说、古建，但缺乏系统整合）；交通可达性一般（距武汉主城45km，需自驾或接驳）；限制因子：涉及永久基本农田约50亩，生态保护红线不涉及，城镇开发边界外。综合评价等级：优良（B+），适合低强度生态旅游开发。',
      sourceType: 'manual',
      sourceName: '踏歌行智策通·资源综合评价模块（人工汇总）',
      manualNote: '建议重点挖掘"茶+文化+生态"三位一体卖点'
    }
  },

  // ============================================================
  // W4：政策引导（四级政策库）
  // ============================================================
  w4_policy: {
    policies: [
      {
        level: '国家级',
        name: '乡村振兴促进法',
        clause: '鼓励利用闲置宅基地和闲置住宅发展乡村旅游、餐饮民宿、文化体验等产业；支持农村集体经营性建设用地入市。',
        sourceType: 'official_api',
        sourceName: '中华人民共和国乡村振兴促进法（2021）',
        manualNote: '定远村有闲置宅基地约15处，可盘活利用'
      },
      {
        level: '国家级',
        name: '关于促进乡村旅游可持续发展的指导意见',
        clause: '到2030年，建成一批乡村旅游重点村，培育一批乡村旅游集群片区；支持乡村旅游与研学、康养、体育等融合发展。',
        sourceType: 'official_api',
        sourceName: '文旅部等17部门·文旅资源发〔2022〕122号',
        manualNote: ''
      },
      {
        level: '省级',
        name: '湖北省旅游条例（修订）',
        clause: '支持利用乡村特色资源发展生态旅游、民宿经济；鼓励将乡村旅游与乡村振兴、文化传承相结合；对符合条件乡村旅游项目给予用地、金融支持。',
        sourceType: 'official_api',
        sourceName: '湖北省旅游条例（2023修订）',
        manualNote: ''
      },
      {
        level: '省级',
        name: '湖北省民宿管理办法',
        clause: '鼓励利用闲置农房发展民宿；单栋民宿客房数不超过14间，总建筑面积不超过800㎡；支持民宿集群发展，打造民宿村。',
        sourceType: 'official_api',
        sourceName: '湖北省民宿管理办法（鄂文旅发〔2023〕8号）',
        manualNote: '定远村可打造为"民宿聚落"，需控制单栋规模'
      },
      {
        level: '市级',
        name: '武汉市全域旅游发展规划（2021-2035）',
        clause: '打造"木兰文化"旅游品牌，构建"木兰文化生态旅游区"；支持黄陂区创建国家全域旅游示范区；每年安排1亿元旅游产业发展专项资金。',
        sourceType: 'official_api',
        sourceName: '武汉市文化和旅游局·武文旅规〔2021〕3号',
        manualNote: '定远村可纳入"木兰文化"旅游环线'
      },
      {
        level: '市级',
        name: '武汉市中小学生研学旅行管理办法',
        clause: '每学年安排1-2次研学旅行，小学3-6年级、初中、高中均须参与；支持依托自然资源、文化遗产资源开发研学课程。',
        sourceType: 'official_api',
        sourceName: '武汉市教育局·武教规〔2022〕5号',
        manualNote: '研学市场是定远村核心客群方向'
      },
      {
        level: '区级',
        name: '黄陂区文旅融合发展扶持办法',
        clause: '对新评定为3A级以上景区给予50-200万元奖励；对民宿床位给予2000元/床补贴（上限100张）；设立2000万元文旅产业发展基金，重点支持木兰文化、生态旅游项目。',
        sourceType: 'official_api',
        sourceName: '黄陂区人民政府·黄文旅规〔2023〕1号',
        manualNote: '民宿补贴政策是重大利好，建议优先申请'
      },
      {
        level: '区级',
        name: '黄陂区关于规范设施农业用地管理的通知',
        clause: '设施农业用地可用于乡村旅游配套设施（餐饮、住宿、停车场等），但不得建设永久性建筑；涉及占用耕地的，须落实耕地"进出平衡"。',
        sourceType: 'official_api',
        sourceName: '黄陂区自然资源和规划局·黄自然资规〔2022〕47号',
        manualNote: '设施农业用地政策是合规开发的关键路径'
      }
    ]
  },

  // ============================================================
  // W5：市场调研（PEST + 客源 + 商圈 + 竞合）
  // ============================================================
  w5_market: {
    // PEST 分析
    pest: {
      political: {
        value: '黄陂区将文旅列为支柱产业，区政府工作报告连续3年提及"木兰文化"品牌建设；乡村振兴补助资金向文旅项目倾斜；国土空间规划明确黄陂区为"生态旅游功能区"。',
        sourceType: 'official_api',
        sourceName: '黄陂区人民政府·2024年政府工作报告 + 黄陂区国土空间总体规划（2021-2035）',
        manualNote: ''
      },
      economic: {
        value: '武汉市人均可支配收入6.8万元（2023），旅游消费意愿强；黄陂区旅游总收入约85亿元（2023），同比增长32%；周边游人均消费约350元/天；定远村所在前川街道农村居民人均可支配收入约2.8万元。',
        sourceType: 'official_api',
        sourceName: '武汉市统计局·2023年武汉市国民经济和社会发展统计公报 + 黄陂区文旅局·2023年旅游经济运行分析',
        manualNote: '消费力充足，但需提升客单价'
      },
      social: {
        value: '亲子研学市场规模超300亿元/年，年增长率超30%；"双减"政策后，中小学生课外活动时间增加，研学旅行需求井喷；城市居民对"乡愁记忆""田园体验"类产品需求旺盛；露营、围炉煮茶等新消费场景热度持续。',
        sourceType: 'ai_aggregation',
        sourceName: '艾媒咨询·2023中国研学旅行行业发展报报 + 小红书/抖音关键词分析',
        manualNote: '亲子研学是定远村最具潜力的客群方向'
      },
      technological: {
        value: '短视频/直播成为文旅主要获客渠道（抖音/小红书占文旅内容消费时长65%）；AI生成内容（AIGC）降低营销素材制作成本；5G+AR/VR技术推动沉浸式文旅体验升级；智慧景区管理系统（票务/安防/导览）已成为标配。',
        sourceType: 'ai_aggregation',
        sourceName: '中国旅游研究院·2024年文旅科技创新发展报告 + 行业白皮书',
        manualNote: '建议定远村项目早期即布局短视频内容矩阵'
      }
    },

    // 客源市场
    touristSource: {
      core: {
        value: '核心客源：前川街道及周边村镇，约30万人；武汉主城家庭客（自驾1小时内可达），约800万人；中小学生研学团体（黄陂区+武汉主城），约120万人/年。',
        sourceType: 'official_api',
        sourceName: '武汉市人口普查数据（2020）+ 黄陂区教育局·2023学年在校学生数',
        manualNote: '核心客群半径约50km，自驾1小时可达'
      },
      secondary: {
        value: '次级客源：孝感市、鄂州市、黄石市等武汉城市圈城市，约500万人；湖北省内其他地市来汉游客（过境游），约200万人/年。',
        sourceType: 'ai_aggregation',
        sourceName: '湖北省文旅厅·2023年省内旅游流分析报告',
        manualNote: ''
      },
      potential: {
        value: '潜在客源：长江经济带主要城市（长沙/南昌/合肥），高铁2-3小时可达；全国范围内"茶文化+研学"主题游客群，约50万人/年（远期）。',
        sourceType: 'ai_aggregation',
        sourceName: '中国旅游研究院·2023年国内旅游客源市场分析报告',
        manualNote: '远期可考虑接入高铁站接驳专线'
      }
    },

    // 商圈分布
    businessDistricts: {
      coreDistrict: {
        label: '核心商圈（0-3km）',
        radius: '0-3km',
        population: '约8万人（前川街道中心区）',
        supply: '餐饮：农家乐12家，无品牌餐饮；住宿：无品牌酒店，仅有2家农家民宿（共约30床位）；零售：便利店、小超市为主，无大型商超。',
        gap: '缺乏品牌餐饮和精品民宿，配套严重不足，是开发机会点。',
        sourceType: 'ai_aggregation',
        sourceName: '美团/大众点评POI数据 + 实地踏勘',
        manualNote: '核心商圈配套缺口大，可优先布局精品民宿和主题餐饮'
      },
      secondaryDistrict: {
        label: '次级商圈（3-10km）',
        radius: '3-10km',
        population: '约30万人（前川街道全境 + 罗汉寺街道部分）',
        supply: '餐饮：品牌餐饮1家（肯德基，前川街道中心）；住宿：经济型酒店3家（约200床位）；娱乐：无。',
        gap: '品牌住宿缺口大，无法满足团队游客需求。',
        sourceType: 'ai_aggregation',
        sourceName: '百度地图POI + OTA平台酒店数据',
        manualNote: ''
      },
      tertiaryDistrict: {
        label: '边缘商圈（10km以上）',
        radius: '10km以上',
        population: '约500万人（武汉主城 + 城市圈，潜在过夜客群）',
        supply: '武汉主城：品牌餐饮/酒店供给充足；木兰草原景区周边：度假酒店/民宿集群（约2000床位）。',
        gap: '定远村可作为"木兰旅游环线"的配套住宿补充。',
        sourceType: 'ai_aggregation',
        sourceName: 'OTA平台（携程/美团）区域酒店数据',
        manualNote: ''
      }
    },

    // 交通可达性
    accessibility: {
      selfDriving: {
        value: '经G318国道直达，距岱黄高速黄陂出口约15分钟车程；距武汉天河机场约40分钟；距汉口火车站约50分钟；村道宽4-5m，会车不便，需拓宽改造。',
        sourceType: 'official_api',
        sourceName: '高德地图·路径规划API + 实地驾车测距',
        manualNote: '建议项目启动时同步申请村道拓宽（需纳入村级公益事业一事一议）'
      },
      publicTransport: {
        value: '距轨道交通1号线汉口北站约8km（需公交接驳）；黄陂区内公交P8路经停前川街道，班次间隔约30分钟；无直达定远村的公共交通；建议开设旅游专线接驳车（前川地铁站↔定远村）。',
        sourceType: 'official_api',
        sourceName: '武汉地铁集团·线网规划图 + 黄陂区交通运输局·公交线路表',
        manualNote: '无轨道交通直达是最大可达性短板，接驳方案是刚需'
      }
    },

    // 竞合分析（三级）
    competitorsByScope: {
      district: [
        {
          name: '野村谷',
          distance: '18km',
          type: 'compete',
          role: '主竞品',
          advantage: '亲子设施完善，服务好，品牌知名度高',
          disadvantage: '缺乏特色IP，同质化严重，门票价格偏高',
          sourceType: 'ai_aggregation',
          sourceName: 'OTA平台评论分析 + 实地暗访调研',
          manualNote: '野村谷的短板（缺乏文化IP）正好是定远村的优势（文化资源富集）'
        },
        {
          name: '定远村（自身）',
          distance: '0km',
          type: 'self',
          role: '基准',
          advantage: '文化资源独特（茶文化+非遗），生态基底优良，成本低',
          disadvantage: '基础设施薄弱，无品牌知名度，交通可达性一般',
          sourceType: 'manual',
          sourceName: '踏歌行智策通·项目基准分析',
          manualNote: ''
        }
      ],
      city: [
        {
          name: '木兰草原',
          distance: '25km',
          type: 'overflow',
          role: '溢出宿主',
          advantage: '品牌知名度高（4A级景区），活动丰富（草原音乐节/马术表演）',
          disadvantage: '距离主城较远（1.5小时车程），门票+体验项目价格偏高',
          sourceType: 'ai_aggregation',
          sourceName: 'OTA平台评论分析 + 小红书内容挖掘',
          manualNote: '木兰草原的客流溢出效应可观，定远村可承接其过夜客群'
        },
        {
          name: '木兰天池',
          distance: '30km',
          type: 'overflow',
          role: '溢出宿主',
          advantage: '山水景观优质，瀑布群落特色鲜明，秋季红叶景观极佳',
          disadvantage: '登山强度大，不适合亲子低龄儿童；餐饮配套不足',
          sourceType: 'ai_aggregation',
          sourceName: '携程/美团评论分析',
          manualNote: ''
        }
      ],
      province: [
        {
          name: '恩施坪坝营',
          distance: '约350km',
          type: 'cooperate',
          role: '对标学习',
          advantage: '原始森林生态独特，高山湿地景观罕见，避暑度假品牌成熟',
          disadvantage: '距离武汉过远（自驾4.5小时），仅适合暑期避暑长住',
          sourceType: 'ai_aggregation',
          sourceName: '湖北省文旅厅·标杆项目考察报告',
          manualNote: '坪坝营的"生态+避暑"模式值得定远村借鉴（规模不同，但逻辑相通）'
        }
      ]
    }
  },

  // ============================================================
  // W6：法规红线（三区三线 + 行业标准）
  // ============================================================
  w6_redline: {
    threeLines: {
      ecoRedLine: {
        value: '✅ 不涉及生态保护红线。经核查，地块范围内无生态保护红线分布（最近生态红线为木兰湖湿地保护区，距离约8km）。',
        status: 'safe',
        sourceType: 'official_api',
        sourceName: '国土空间规划"一张图"·生态保护红线图层',
        manualNote: ''
      },
      farmland: {
        value: '⚠️ 涉及少量永久基本农田（约50亩，主要分布于村南梯田区域）。根据《土地管理法》，永久基本农田不得占用；如需占用，须报国务院批准，且须落实"占补平衡"（补划同等数量和质量的基本农田）。',
        status: 'warning',
        sourceType: 'official_api',
        sourceName: '国土调查云·永久基本农田保护区图层',
        manualNote: '建议调整开发边界，避开这50亩基本农田；或申请设施农业用地政策（见W4政策库）'
      },
      urbanBoundary: {
        value: '✅ 位于城镇开发边界外（符合乡村旅游用地政策）。地块不在黄陂区城镇开发边界内，可适用"乡村建设用地"政策，无需走招拍挂程序。',
        status: 'safe',
        sourceType: 'official_api',
        sourceName: '黄陂区国土空间总体规划（2021-2035）·城镇开发边界图层',
        manualNote: ''
      }
    },
    // 行业标准 / 法规依据
    industryRegulations: [
      {
        name: '露营营地建设标准（T/CCT DA2-2021）',
        requirement: '营地与高压线路距离≥200m；与易燃易爆场所距离≥500m；单营地最大容量≤500人；须配备消防、医疗、垃圾处理设施。',
        sourceType: 'official_api',
        sourceName: '中国营地教育联盟·T/CCT DA2-2021',
        manualNote: '如建设营地，须按此标准做安全评估'
      },
      {
        name: '乡村旅游民宿服务质量等级划分与评定（LB/T 065-2019）',
        requirement: '金宿级：客房≥10间，公共活动区域≥100㎡，须提供文化体验活动；银宿级：客房≥5间，须提供特色餐饮服务。',
        sourceType: 'official_api',
        sourceName: '文化和旅游部·LB/T 065-2019',
        manualNote: '建议按"金宿级"标准建设民宿聚落'
      },
      {
        name: '研学旅行服务规范（GB/T 39027-2020）',
        requirement: '研学课程须与学校课程衔接；须配备持证研学导师（师生比≤1:15）；须购买研学专用保险；须制定安全应急预案。',
        sourceType: 'official_api',
        sourceName: '国家市场监督管理总局·GB/T 39027-2020',
        manualNote: '研学资质是定远村核心竞争力，建议提前布局'
      }
    ]
  },

  // ============================================================
  // W7：SWOT 分析（自动汇总自 W3/W4/W5/W6）
  // ============================================================
  w7_swot: {
    S: [
      {
        title: '岗丘生态基底优良',
        point: '2000亩岗丘肌理，林—田—水复合生态基底优良（源自 W3 自然资源调查）',
        source: 'W3_resource.naturalLandscape / ecosystem',
        sourceType: 'ai_aggregation'
      },
      {
        title: '茶文化IP独特',
        point: '茶文化IP独特："仙女撒茶籽"传说 + 百年古茶树30株 + 连片茶园120亩（源自 W3 人文资源）',
        source: 'W3_resource.legendsAndStories / ancientTrees / vegetation',
        sourceType: 'manual'
      },
      {
        title: '文化资源富集',
        point: '文化资源富集：省级非遗"黄陂彩词"传承人2名 + 清代古民居3处 + 古驿道遗址（源自 W3）',
        source: 'W3_resource.intangibleHeritage / historicalSites',
        sourceType: 'official_api'
      },
      {
        title: '政策红利集中',
        point: '政策红利集中：黄陂区文旅产业基金2000万元 + 民宿补贴2000元/床 + 设施农业用地政策灵活（源自 W4）',
        source: 'W4_policy.policies[6] / [7]',
        sourceType: 'official_api'
      },
      {
        title: '土地与劳动力成本低',
        point: '成本优势：位于城镇开发边界外，土地成本低；劳动力成本低于武汉主城（源自 W6 + W5）',
        source: 'W6_redline.threeLines.urbanBoundary + W5_market.pest.economic',
        sourceType: 'official_api'
      }
    ],
    W: [
      {
        title: '基本农田限制',
        point: '涉及永久基本农田约50亩，开发边界受限，须规避集中建设（源自 W6）',
        source: 'W6_redline.threeLines.farmland',
        sourceType: 'official_api'
      },
      {
        title: '交通可达性弱',
        point: '交通可达性一般：无轨道交通直达，村道宽仅4-5m会车不便（源自 W5）',
        source: 'W5_market.accessibility',
        sourceType: 'official_api'
      },
      {
        title: '基础设施薄弱',
        point: '基础设施薄弱：无天然气、无品牌住宿餐饮配套（源自 W3 + W5商圈分析）',
        source: 'W3_resource.modernFacilities + W5_market.businessDistricts',
        sourceType: 'official_api'
      },
      {
        title: '品牌知名度为零',
        point: '品牌知名度为零，需从零开始做市场推广（源自 W5竞合分析）',
        source: 'W5_market.competitorsByScope.district',
        sourceType: 'ai_aggregation'
      }
    ],
    O: [
      {
        title: '研学需求旺盛',
        point: '研学需求旺盛：武汉市中小学生约120万人/年，研学旅行政策强力推动（源自 W5 + W4）',
        source: 'W5_market.touristSource.core + W4_policy.policies[4]',
        sourceType: 'official_api'
      },
      {
        title: '亲子文旅增长快',
        point: '亲子文旅市场年增长超30%，"茶文化+研学"主题市场缺口大（源自 W5 PEST分析）',
        source: 'W5_market.pest.social',
        sourceType: 'ai_aggregation'
      },
      {
        title: '头部景区溢出',
        point: '木兰草原等头部景区溢出效应：年接待量超200万人次，过夜客群承接需求大（源自 W5竞合分析）',
        source: 'W5_market.competitorsByScope.city',
        sourceType: 'ai_aggregation'
      },
      {
        title: '用地政策灵活',
        point: '设施农业用地政策灵活，可合法建设乡村旅游配套（餐饮/住宿/停车场）（源自 W4）',
        source: 'W4_policy.policies[7]',
        sourceType: 'official_api'
      }
    ],
    T: [
      {
        title: '同质化竞争激烈',
        point: '同质化竞争：野村谷、木兰草原等已占据"木兰文化"品牌认知，后来者突围难度大（源自 W5竞合分析）',
        source: 'W5_market.competitorsByScope',
        sourceType: 'ai_aggregation'
      },
      {
        title: '用地政策变动',
        point: '政策变动风险：设施农业用地政策若收紧，将直接影响项目合规性（源自 W4/W6）',
        source: 'W4_policy.policies[7] + W6_redline.industryRegulations',
        sourceType: 'official_api'
      },
      {
        title: '生态保护趋严',
        point: '生态保护要求趋严：虽不涉及生态红线，但塘堰湿地生态系统敏感，开发须低冲击（源自 W3/W6）',
        source: 'W3_resource.ecosystem + W6_redline.threeLines.ecoRedLine',
        sourceType: 'official_api'
      }
    ]
  },

  // ============================================================
  // W8：需求澄清（主观 - 甲方诉求 + 优势资源确认）
  // ============================================================
  w8_demand: {
    // 甲方诉求（Radio 表单，人工输入）
    clientDemands: [
      {
        key: 'payback',
        question: '期望投资回报周期',
        options: ['≤ 4年', '4 - 7年', '≥ 7年'],
        answer: '≤ 4年',
        sourceType: 'manual',
        sourceName: '甲方诉求调研表',
        manualNote: '回报周期要求较紧，建议做现金流压力测试'
      },
      {
        key: 'operation',
        question: '运营团队经验',
        options: ['有成熟运营团队', '需外包专业运营公司', '村民合作社自营'],
        answer: '需外包专业运营公司',
        sourceType: 'manual',
        sourceName: '甲方诉求调研表',
        manualNote: '建议引入具备研学营地运营经验的第三方机构'
      },
      {
        key: 'socialRelation',
        question: '当地社会关系（村支书/村委会支持度）',
        options: ['强（已签订合作意向）', '中（有接触但尚未签约）', '弱（存在村民抵触风险）'],
        answer: '强（已签订合作意向）',
        sourceType: 'manual',
        sourceName: '甲方诉求调研表',
        manualNote: '村支书支持是重大利好，建议优先启动村民沟通会'
      }
    ],
    // 优势资源确认（Checkbox，人工确认）
    confirmedAdvantages: [
      { key: 'teaCulture', label: '茶文化（仙女撒茶籽传说 + 古茶树 + 茶园）', confirmed: true, sourceType: 'manual', sourceName: 'W8 优势资源确认表' },
      { key: 'intangible', label: '非遗资源（黄陂彩词传承人2名）', confirmed: true, sourceType: 'manual', sourceName: 'W8 优势资源确认表' },
      { key: 'ecoBase', label: '生态基底（林—田—水复合肌理，覆盖率>60%）', confirmed: true, sourceType: 'manual', sourceName: 'W8 优势资源确认表' },
      { key: 'location', label: '区位条件（武汉1小时自驾圈，木兰旅游环线节点）', confirmed: false, sourceType: 'manual', sourceName: 'W8 优势资源确认表', manualNote: '需进一步评估交通便利性短板的影响' },
      { key: 'policy', label: '政策红利（黄陂区2000万文旅基金 + 民宿补贴）', confirmed: true, sourceType: 'manual', sourceName: 'W8 优势资源确认表' }
    ]
  },

  // ============================================================
  // W9：战略定位（数据盘存 + 命名 + 三级建议）
  // ============================================================
  w9_position: {
    // 数据盘存摘要（自动汇总自 W2-W8）
    dataSummary: {
      land: '地块2000亩，城郊缓丘岗地，不涉及生态红线，涉及永久基本农田约50亩',
      resource: '自然资源优良（覆盖率>60%），文化资源富集（非遗/古建/传说），但碎片化缺乏整合',
      policy: '四级政策红利集中，黄陂区文旅基金2000万 + 民宿补贴，设施农业用地政策灵活',
      market: '核心客群800万人（武汉主城1小时圈），研学需求旺盛，竞品同质化严重缺乏文化IP',
      regulation: '合规前提：避开50亩基本农田，利用设施农业用地政策合法建设配套',
      demand: '甲方预算≤8000万，回报周期≤4年，村支书支持（强），需外包运营'
    },

    // 项目命名（逻辑推导）
    naming: {
      projectName: {
        value: '踏歌行·定远森系研学营地',
        logic: '命名逻辑：【品牌前缀】踏歌行（智策通品牌）+【地名】定远（村名锚定）+【核心卖点】森系（生态基底）+ 研学营地（功能定位）',
        sourceType: 'manual',
        sourceName: '踏歌行智策通·战略定位模块（逻辑推导）',
        manualNote: '备选名：定远茶谷研学营地 / 仙女坡森系研学基地'
      },
      slogan: {
        value: '黄陂前川·定远｜城郊森系研学，一程茶香入梦',
        logic: 'Slogan逻辑：【地名锚定】黄陂前川·定远 +【核心体验】城郊森系研学 +【记忆点】茶香（文化IP）',
        sourceType: 'manual',
        sourceName: '踏歌行智策通·战略定位模块（逻辑推导）',
        manualNote: ''
      }
    },

    // 三级建议方案
    recommendations: [
      {
        level: '优选',
        tag: '推荐',
        strategy: '低冲击开发 + 茶文化IP 深耕：依托2000亩岗丘肌理，采用"点状供地、散点布局"模式（设施农业用地政策），首期开发约300亩（避开基本农田）；核心产品：①茶文化研学课程（采茶—制茶—品茶全流程）+ ②森系营地（露营+星空屋）+ ③非遗工坊（黄陂彩词+采茶戏）；投资估算：约5500万（含民宿改建/营地建设/课程研发）；预期回报周期：3.5年。',
        highlights: ['符合设施农业用地政策，合规性高', '茶文化IP差异化强，避开与木兰草原正面竞争', '研学+营地双轮驱动，现金流稳定'],
        risks: ['需协调村民土地流转，周期约6-12个月', '研学导师团队需提前招募培训'],
        sourceType: 'manual',
        sourceName: '踏歌行智策通·战略定位模块（逻辑推导）',
        manualNote: '优选方案是综合评分最高的方案，建议以此为基础深化设计'
      },
      {
        level: '中选',
        tag: '备选',
        strategy: '适度开发 + 民宿聚落：利用现有50栋传统民居，改造成精品民宿聚落（按金宿级标准）；配套建设村民食堂（餐饮中心）和村民市集（农特产品售卖）；开发强度中等（容积率≤0.3）；投资估算：约4500万；预期回报周期：4.2年。',
        highlights: ['利用闲置农房，成本低，政策合规性强', '民宿聚落模式成熟，运营风险低', '可争取黄陂区民宿补贴（2000元/床，上限100张）'],
        risks: ['传统民居改造成本不可控（部分需结构性加固）', '民宿市场竞争激烈，需做强文化内容差异化'],
        sourceType: 'manual',
        sourceName: '踏歌行智策通·战略定位模块（逻辑推导）',
        manualNote: ''
      },
      {
        level: '慎选',
        tag: '不推荐',
        strategy: '重资产建设 + 大型游乐设施：征占2000亩全域，建设大型室内游乐馆、玻璃栈道、索道等高强度旅游设施；开发强度高（容积率≥0.8）；投资估算：约1.8亿；预期回报周期：≥8年。',
        highlights: ['规模效应显著，一旦成功可形成区域垄断'],
        risks: ['涉及基本农田调整，合规性风险极高', '投资远超甲方预算（≤8000万）', '回报周期过长，与甲方诉求（≤4年）严重不符', '同质化严重，与周边景区（木兰草原等）正面竞争'],
        sourceType: 'manual',
        sourceName: '踏歌行智策通·战略定位模块（逻辑推导）',
        manualNote: '慎选方案与甲方诉求严重不匹配，且合规风险高，不建议采用'
      }
    ]
  },

  // ============================================================
  // W10：三向成果（交付文档）
  // ============================================================
  w10_result: {
    results: [
      {
        id: 'A',
        title: 'A版：项目投资开发建议书',
        content: '《踏歌行·定远森系研学营地 项目投资开发建议书》\n\n一、项目背景\n定远村位于武汉市黄陂区前川街道，地块面积约2000亩，为城郊缓丘岗地。项目依托"茶文化+非遗+生态"三位一体资源禀赋，打造差异化研学营地产品。\n\n二、市场分析\n核心客群：武汉主城家庭客（800万人，自驾1小时可达）+ 中小学生研学团体（120万人/年）。竞品分析：木兰草原（溢出宿主）、野村谷（主竞品，缺乏文化IP）。\n\n三、产品策略\n首选方案：低冲击开发 + 茶文化IP深耕。首期开发约300亩，核心产品：①茶文化研学课程 ②森系营地 ③非遗工坊。\n\n四、投资估算\n首期投资约5500万，其中：民宿改建2000万、营地建设1500万、课程研发500万、流动资金1500万。\n\n五、回报预测\n预期年接待量8万人次，客单价350元/天，年营收约2800万，回报周期3.5年。',
        downloadUrl: '',
        sourceType: 'manual',
        sourceName: '踏歌行智策通·成果生成模块',
        manualNote: 'A版建议书可作为向投资方/政府汇报的正式文档'
      },
      {
        id: 'B',
        title: 'B版：地块招商参考方案',
        content: '《定远村文旅项目 地块招商参考方案》\n\n一、地块概况\n地块面积2000亩，城郊缓丘岗地，不涉及生态红线，涉及永久基本农田约50亩（须规避）。土地性质：集体建设用地（部分）+ 农用地（茶园/林地）。\n\n二、招商方向\n① 研学营地运营商（具备课程体系研发能力）\n② 精品民宿品牌（具备金宿级民宿运营经验）\n③ 茶文化体验空间运营商（具备茶旅融合产品开发能力）\n\n三、合作模式\n推荐：村集体以土地入股 + 运营商以资金和运营入股，按3:7比例分红；期限20年，每5年评估一次。\n\n四、政策支持\n黄陂区文旅基金最高2000万补贴；民宿床位补贴2000元/床（上限100张）；设施农业用地政策可合法建设旅游配套。\n\n五、联系信息\n招商主体：定远村村民委员会\n联系人：村支书 张XX\n联系电话：027-XXXXXXX',
        downloadUrl: '',
        sourceType: 'manual',
        sourceName: '踏歌行智策通·成果生成模块',
        manualNote: 'B版招商方案可作为向潜在合作方推介的使用文档'
      },
      {
        id: 'C',
        title: 'C版：项目规划参考建议',
        content: '《踏歌行·定远森系研学营地 项目规划参考建议》\n\n一、空间布局建议\n推荐"一核两翼三片区"布局：\n- 一核：综合服务中心（村口古樟树区域，含接待/餐饮/零售）\n- 两翼：①茶文化研学翼（村中茶园区域）②森系营地翼（村北林地区域）\n- 三片区：民宿聚落片区（村中心传统民居改扩建）、户外拓展片区（村南岗地区域）、湿地科普片区（村南塘堰区域）\n\n二、合规要点\n① 避开50亩永久基本农田（村南梯田区域）\n② 利用设施农业用地政策建设配套（单栋≤800㎡，总占比≤10%）\n③ 不涉及生态保护红线\n\n三、建设时序建议\n首期（0-12个月）：民宿改建（3-5栋示范）+ 茶文化研学课程研发 + 道路拓宽\n二期（12-24个月）：营地建设 + 非遗工坊 + 综合服务中心\n三期（24-36个月）：民宿聚落扩建 + 湿地科普区 + 品牌推广\n\n四、运营建议\n① 引入专业运营机构（具备研学+营地双重经验）\n② 与武汉中小学签订研学合作协议（提前锁定客源）\n③ 布局短视频内容矩阵（抖音/小红书），提前6个月启动预热',
        downloadUrl: '',
        sourceType: 'manual',
        sourceName: '踏歌行智策通·成果生成模块',
        manualNote: 'C版规划建议可作为设计院/规划院深化设计的输入文档'
      }
    ]
  }
};

module.exports = {
  mockData
};
