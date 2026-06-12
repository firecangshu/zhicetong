// utils/rules.js
// 由 rules.json 转换而来，供 engine.js 引用
// V2.2 - 2026-06-11

module.exports = {
  "_meta": {
    "version": "1.0",
    "generated_at": "2026-06-11",
    "source": "utils/engine.js",
    "description": "踏歌行智策通四维评分规则清单"
  },
  "weights": {
    "compliance": 0.35,
    "spatial": 0.25,
    "economic": 0.20,
    "market": 0.20
  },
  "decision_rules": [
    {
      "id": "D001",
      "name": "合规硬过滤",
      "condition": "compliance.score <= 30",
      "result": "NO-GO",
      "reason": "合规风险过高，一票否决",
      "priority": 100
    },
    {
      "id": "D002",
      "name": "综合通过",
      "condition": "totalScore >= 75 AND compliance.score >= 60",
      "result": "GO",
      "reason": "综合条件良好，建议推进",
      "priority": 80
    },
    {
      "id": "D003",
      "name": "有条件通过",
      "condition": "totalScore >= 55",
      "result": "CONDITIONAL",
      "reason": "有条件通过，需在前置条件满足后推进",
      "priority": 60
    },
    {
      "id": "D004",
      "name": "暂停建议",
      "condition": "totalScore < 55",
      "result": "PAUSE",
      "reason": "建议暂停，补充调研或调整定位",
      "priority": 40
    }
  ],
  "compliance_rules": {
    "base_score": 70,
    "rules": [
      {
        "id": "R001",
        "name": "生态红线硬过滤",
        "priority": "P0",
        "field": "redline.eco",
        "operator": "not_contains",
        "value": "✅",
        "action": "subtract",
        "amount": 30,
        "effect": "合规分上限70，冲突后直接降至40以下，触发NO-GO",
        "domain_source": "《生态保护红线划定指南》+ 国土空间规划'三区三线'",
        "evidence_level": "E2"
      },
      {
        "id": "R002",
        "name": "耕地保护硬过滤",
        "priority": "P0",
        "field": "redline.farm",
        "operator": "not_contains",
        "value": "✅",
        "action": "subtract",
        "amount": 20,
        "effect": "合规分降至50以下，基本无法通过",
        "domain_source": "《土地管理法》+ 永久基本农田保护条例",
        "evidence_level": "E2"
      },
      {
        "id": "R003",
        "name": "建设用地限制",
        "priority": "P1",
        "field": "redline.build",
        "operator": "contains",
        "value": "⚠️",
        "action": "subtract",
        "amount": 15,
        "effect": "建议采用设施农用地或存量盘活方式",
        "domain_source": "自然资源部关于保障农村一二三产业融合发展用地的通知",
        "evidence_level": "E2"
      },
      {
        "id": "R004",
        "name": "政策利好加分",
        "priority": "P2",
        "field": "policy.policies",
        "operator": "array_item_equals",
        "item_field": "direction",
        "value": "利好",
        "action": "add_per_item",
        "amount": 5,
        "effect": "政策红利可提升合规评分",
        "domain_source": "各地方文旅产业扶持政策",
        "evidence_level": "E1"
      },
      {
        "id": "R005",
        "name": "政策约束减分",
        "priority": "P2",
        "field": "policy.policies",
        "operator": "array_item_equals",
        "item_field": "direction",
        "value": "约束",
        "action": "subtract_per_item",
        "amount": 10,
        "effect": "政策约束显著降低评分权重",
        "domain_source": "各地方环保、限建等政策文件",
        "evidence_level": "E1"
      },
      {
        "id": "R013",
        "name": "政策等级评分",
        "priority": "P1",
        "field": "policy.policies",
        "operator": "level_score",
        "item_field": "level",
        "level_scores": {
          "国家级": 20,
          "省级": 10,
          "市级": 5,
          "区级": 2
        },
        "effect": "高级别政策加持，红利强度更高",
        "domain_source": "《乡村振兴促进法》+ 湖北省/武汉市文旅产业政策层级分析",
        "evidence_level": "E2"
      }
    ]
  },
  "spatial_rules": {
    "base_score": 65,
    "landTypeWeights": {
      "林地": 10,
      "园地": 8,
      "耕地": -5,
      "建设用地": 15,
      "水域": 5,
      "荒地": 3,
      "其他": 0
    },
    "rules": [
      {
        "id": "R006",
        "name": "林地适宜性加分",
        "priority": "P1",
        "field": "resource.landType",
        "operator": "contains",
        "value": "林地",
        "action": "add",
        "amount": 10,
        "effect": "林地/园地肌理适合低冲击开发",
        "domain_source": "《林地保护利用规划》+ 低影响开发(LID)实践",
        "evidence_level": "E2"
      },
      {
        "id": "R007",
        "name": "复合景观加分",
        "priority": "P1",
        "field": "resource.landscape",
        "operator": "contains",
        "value": "复合",
        "action": "add",
        "amount": 10,
        "effect": "岗丘—林—田—塘复合肌理具备内容差异化优势",
        "domain_source": "景观生态学'斑块-廊道-基质'理论",
        "evidence_level": "E2"
      },
      {
        "id": "R008",
        "name": "规模效应加分",
        "priority": "P2",
        "field": "land.area",
        "operator": "contains",
        "value": "2000",
        "action": "add",
        "amount": 5,
        "effect": "2000亩尺度具备规模效应，可分摊基础设施成本",
        "domain_source": "文旅项目经济规模效应经验值",
        "evidence_level": "E1"
      },
      {
        "id": "R016",
        "name": "交通可达性评分",
        "priority": "P1",
        "field": "market.transport",
        "operator": "level_score",
        "level_scores": {
          "<1h": 15,
          "1-2h": 10,
          ">2h": 0
        },
        "effect": "可达性越高，空间维度评分越高",
        "domain_source": "城市旅游圈层理论 + 高德地图路径规划API实测",
        "evidence_level": "E2"
      }
    ]
  },
  "economic_rules": {
    "base_score": 60,
    "rules": [
      {
        "id": "R009",
        "name": "回报周期惩罚",
        "priority": "P1",
        "field": "market.cycle",
        "operator": "contains",
        "value": "5-6",
        "action": "subtract",
        "amount": 10,
        "effect": "基准回报周期较长，需优化收入结构",
        "domain_source": "文旅行业投资回报基准（行业标准4-5年）",
        "evidence_level": "E1"
      },
      {
        "id": "R010",
        "name": "近郊区位加分",
        "priority": "P1",
        "field": "market.position",
        "operator": "contains",
        "value": "近郊",
        "action": "add",
        "amount": 15,
        "effect": "近郊高频消费圈具备客流稳定性优势",
        "domain_source": "城市旅游圈层理论（1-2小时车程圈）",
        "evidence_level": "E2"
      },
      {
        "id": "R015",
        "name": "预算可行性评分",
        "priority": "P1",
        "field": "budget",
        "operator": "range_score",
        "ranges": [
          { "max": 100, "score": 20 },
          { "min": 100, "max": 300, "score": 10 },
          { "min": 300, "score": 0 }
        ],
        "effect": "预算越低可行性越高（<100万+20，100-300万+10，>300万+0）",
        "domain_source": "文旅项目投资收益基准分析（行业标准）",
        "evidence_level": "E1"
      }
    ]
  },
  "market_rules": {
    "base_score": 70,
    "rules": [
      {
        "id": "R011",
        "name": "研学需求加分",
        "priority": "P1",
        "field": "market.demand",
        "operator": "contains",
        "value": "研学",
        "action": "add",
        "amount": 10,
        "effect": "研学旅行需求旺盛，建议B2B渠道优先布局",
        "domain_source": "教育部研学旅行政策 + OTA预订数据趋势",
        "evidence_level": "E2"
      },
      {
        "id": "R012",
        "name": "市场份额加分",
        "priority": "P2",
        "field": "market.chartData.series[0].data",
        "operator": "sum_gte",
        "value": 20,
        "action": "add",
        "amount": 5,
        "effect": "市场份额预估较高，具备区域竞争力",
        "domain_source": "市场集中度分析（CR4/CR8指标）",
        "evidence_level": "E1"
      },
      {
        "id": "R014",
        "name": "市场需求强度评分",
        "priority": "P1",
        "field": "market.demandIntensity",
        "operator": "level_score",
        "level_scores": {
          "高": 15,
          "中": 10,
          "低": 5
        },
        "effect": "需求强度越高，市场维度评分越高",
        "domain_source": "教育部研学旅行政策 + OTA预订数据趋势分析",
        "evidence_level": "E2"
      }
    ]
  }
};
