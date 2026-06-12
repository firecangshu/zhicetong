// utils/engine.js
// 四维决策引擎：合规 × 空间 × 经济 × 市场 → 输出 GO / PAUSE / CONDITIONAL / NO-GO
// V2.1 规则结构化版：从 rules.json 加载评分规则

var rules = require('./rules.js');

/**
 * 四维评分引擎
 * @param {Object} params - { land, resource, policy, market, redline }
 * @returns {Object} { verdict, confidence, dimensions, suggestion }
 */
function evaluate(params) {
  // ==================== 维度1：合规（蓝 #1A6DFF）====================
  var compliance = evaluateCompliance(params.redline, params.policy);

  // ==================== 维度2：空间（绿 #00B365）====================
  var spatial = evaluateSpatial(params.land, params.resource, params.market);

  // ==================== 维度3：经济（橙 #F5A623）====================
  var economic = evaluateEconomic(params.market, params.land);

  // ==================== 维度4：市场（紫 #8C6BFF）====================
  var market = evaluateMarket(params.market);

  var dimensions = [compliance, spatial, economic, market];

  // 加权总分（从 rules.json 加载权重）
  var w = rules.weights;
  var totalScore = compliance.score * w.compliance +
                   spatial.score * w.spatial +
                   economic.score * w.economic +
                   market.score * w.market;

  // 决策逻辑（从 rules.json 加载阈值）
  var verdict = 'PAUSE';
  var suggestion = '';
  var dr = rules.decision_rules;

  if (compliance.score <= 30) {  // D001: 合规硬过滤
    verdict = 'NO-GO';
    suggestion = '⛔ 合规风险过高，建议重新选址或调整开发方式。';
  } else if (totalScore >= 75 && compliance.score >= 60) {  // D002: 综合通过
    verdict = 'GO';
    suggestion = '✅ 综合条件良好，建议推进。优先落实合规手续与内容运营。';
  } else if (totalScore >= 55) {  // D003: 有条件通过
    verdict = 'CONDITIONAL';
    suggestion = '⚠️ 有条件通过。需在前置条件满足后推进（详见各维度建议）。';
  } else {  // D004: 暂停建议
    verdict = 'PAUSE';
    suggestion = '⏸️ 建议暂停，补充调研或调整定位后再评估。';
  }

  // 置信度（确定性计算，基于总分映射）
  var confidence = Math.min(95, Math.round(totalScore + 10));

  return {
    verdict: verdict,
    confidence: confidence,
    totalScore: Math.round(totalScore),
    dimensions: dimensions,
    suggestion: suggestion
  };
}

// ==================== 合规维度 ====================
function evaluateCompliance(redline, policy) {
  var cr = rules.compliance_rules;
  var score = cr.base_score; // 从 rules.json 加载基准分
  var risks = [];
  var suggestions = [];

  if (redline) {
    // R001: 生态红线硬过滤
    if (redline.eco && redline.eco.indexOf('✅') === -1) {
      score -= 30;
      risks.push('生态保护红线冲突');
    }
    // R002: 耕地保护硬过滤
    if (redline.farm && redline.farm.indexOf('✅') === -1) {
      score -= 20;
      risks.push('耕地保护冲突');
    }
    // R003: 建设用地限制
    if (redline.build && redline.build.indexOf('⚠️') !== -1) {
      score -= 15;
      suggestions.push('建议采用设施农用地/存量盘活方式，避免新增建设用地');
    }
  }

  // R004/R005: 政策利好加分 / 约束减分
  // R013: 政策等级评分（国家级+20/省级+10/市级+5/区级+2）
  if (policy && policy.policies) {
    policy.policies.forEach(function (p) {
      if (p.direction === '利好') score += 5;
      if (p.direction === '约束') score -= 10;
      // R013: 政策等级评分
      if (p.level === '国家级') score += 20;
      else if (p.level === '省级') score += 10;
      else if (p.level === '市级') score += 5;
      else if (p.level === '区级') score += 2;
    });
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: '合规',
    color: '#1A6DFF',
    score: score,
    risks: risks,
    suggestions: suggestions,
    detail: '基于生态保护红线、耕地保护、城镇开发边界叠加分析。'
  };
}

// ==================== 空间维度 ====================
function evaluateSpatial(land, resource, market) {
  var sr = rules.spatial_rules;
  var score = sr.base_score; // 从 rules.json 加载基准分
  var suggestions = [];

  if (resource) {
    // R006: 土地类型权重适配（从 rules.json 加载 landTypeWeights 映射表）
    if (resource.landType && sr.landTypeWeights) {
      var matched = false;
      var types = Object.keys(sr.landTypeWeights);
      for (var i = 0; i < types.length; i++) {
        if (resource.landType.indexOf(types[i]) !== -1) {
          var weight = sr.landTypeWeights[types[i]];
          score += weight;
          if (weight > 0) {
            suggestions.push(types[i] + '土地类型适宜开发（+' + weight + '分）');
          } else if (weight < 0) {
            suggestions.push(types[i] + '土地类型需限制开发（' + weight + '分）');
          }
          matched = true;
          break;
        }
      }
      // 未匹配时使用"其他"默认值
      if (!matched && sr.landTypeWeights['其他'] !== undefined) {
        score += sr.landTypeWeights['其他'];
      }
    }
    // R007: 复合景观加分
    if (resource.landscape && resource.landscape.indexOf('复合') !== -1) {
      score += 10;
      suggestions.push('岗丘—林—田—塘复合肌理具备内容差异化优势');
    }
  }

  if (land) {
    // R008: 规模效应加分
    if (land.area && land.area.indexOf('2000') !== -1) {
      score += 5;
      suggestions.push('2000亩尺度具备规模效应，可分摊基础设施成本');
    }
  }

  // R016: 交通可达性评分（从 market.transport 读取）
  if (market && market.transport) {
    if (market.transport === '<1h') {
      score += 15;
      suggestions.push('交通可达性高（1小时内可达），客群覆盖广');
    } else if (market.transport === '1-2h') {
      score += 10;
      suggestions.push('交通可达性中等（1-2小时车程），适合周末游');
    } else if (market.transport === '>2h') {
      score += 0;
      suggestions.push('交通可达性较低（2小时以上），需重点解决过夜需求');
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: '空间',
    color: '#00B365',
    score: score,
    suggestions: suggestions,
    detail: '基于地形地貌、土地利用类型、景观肌理综合评估。'
  };
}

// ==================== 经济维度 ====================
function evaluateEconomic(market, land) {
  var er = rules.economic_rules;
  var score = er.base_score; // 从 rules.json 加载基准分
  var suggestions = [];

  if (market) {
    // R009: 回报周期惩罚
    if (market.cycle && market.cycle.indexOf('5–6') !== -1) {
      score -= 10;
      suggestions.push('基准回报周期较长，需通过非门票收入优化（目标压缩至4.5年）');
    }
    // R010: 近郊区位加分
    if (market.position && market.position.indexOf('近郊') !== -1) {
      score += 15;
      suggestions.push('近郊高频消费圈具备客流稳定性优势');
    }
    // R015: 预算可行性评分
    if (market.budget !== undefined) {
      var b = market.budget;
      if (b < 100) {
        score += 20;
        suggestions.push('预算充足（<' + b + '万），项目可行性高');
      } else if (b >= 100 && b <= 300) {
        score += 10;
        suggestions.push('预算适中（' + b + '万），建议优化成本结构');
      } else {
        score += 0;
        suggestions.push('预算较高（' + b + '万），需谨慎评估回报');
      }
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: '经济',
    color: '#F5A623',
    score: score,
    suggestions: suggestions,
    detail: '基于投资回报周期、客流规模、收入结构综合评估。'
  };
}

// ==================== 市场维度 ====================
function evaluateMarket(market) {
  var mr = rules.market_rules;
  var score = mr.base_score; // 从 rules.json 加载基准分
  var suggestions = [];

  if (market) {
    // R011: 研学需求加分
    if (market.demand && market.demand.indexOf('研学') !== -1) {
      score += 10;
      suggestions.push('研学旅行需求旺盛，建议B2B渠道优先布局');
    }
    // R012: 市场份额加分
    if (market.chartData && market.chartData.series) {
      var total = 0;
      market.chartData.series[0].data.forEach(function (v) { total += v; });
      if (total >= 20) {
        score += 5;
        suggestions.push('市场份额预估较高，具备区域竞争力');
      }
    }
    // R014: 市场需求强度评分
    if (market.demandIntensity === '高') {
      score += 15;
      suggestions.push('市场需求强度高，具备客流爆发潜力');
    } else if (market.demandIntensity === '中') {
      score += 10;
      suggestions.push('市场需求强度中等，建议差异化定位');
    } else if (market.demandIntensity === '低') {
      score += 5;
      suggestions.push('市场需求强度较低，需谨慎评估回报');
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: '市场',
    color: '#8C6BFF',
    score: score,
    suggestions: suggestions,
    detail: '基于客群画像、市场份额预估、竞争格局综合评估。'
  };
}

module.exports = {
  evaluate: evaluate
};
