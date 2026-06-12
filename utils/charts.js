/**
 * 图表绘制工具函数集合
 * 使用 Canvas 2D API（替代已废弃的 createCanvasContext）
 * 
 * 使用方法：
 * const ctx = await getCanvasContext(this, 'radarCanvas');
 * drawRadarChart(ctx, canvas, dpr, indicators, score);
 */

/**
 * 获取 Canvas 2D 上下文（现代 API）
 * @param {Page} page - 页面实例（this）
 * @param {string} canvasId - canvas 的 id
 * @returns {Promise<{ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dpr: number}>}
 */
function getCanvasContext(page, canvasId) {
  return new Promise((resolve, reject) => {
    // 延时确保 WXML 节点已渲染
    setTimeout(() => {
      const query = wx.createSelectorQuery();
      let resolved = false;

      // 超时保护：5秒后强制 reject（延长至 5s，避免偶发超时）
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error(`Canvas #${canvasId} 查询超时（5s），请检查 canvas 元素是否存在`));
        }
      }, 5000);

      query.select(`#${canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          clearTimeout(timeoutId);
          if (resolved) return;
          resolved = true;

          if (!res || !res[0] || !res[0].node) {
            reject(new Error(`Canvas #${canvasId} not found, res=` + JSON.stringify(res)));
            return;
          }
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          // Use new API to avoid deprecation warning
          let dpr = 2;
          try {
            const windowInfo = wx.getWindowInfo();
            dpr = windowInfo.pixelRatio || 2;
          } catch (e) {
            // No fallback to getSystemInfoSync - new APIs available from base library 2.20.1+
            dpr = 2;
          }
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);
          resolve({ ctx, canvas, dpr });
        });
    }, 150);
  });
}

/**
 * 绘制雷达图
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} options - { indicators: [{name, value}], center: {x, y}, radius: number, colors: {fill, stroke, text, grid} }
 */
function drawRadarChart(ctx, options) {
  const {
    indicators = [],
    center = { x: 150, y: 150 },
    radius = 120,
    colors = {
      fill: 'rgba(26, 109, 255, 0.2)',
      stroke: '#1A6DFF',
      text: '#1A1A2E',
      grid: '#E8F4FD',
      scoreFill: '#1A6DFF',
      scoreText: '#FFFFFF'
    }
  } = options;

  const count = indicators.length;
  const angleStep = (Math.PI * 2) / count;

  // 绘制同心网格（5圈）
  for (let level = 1; level <= 5; level++) {
    const r = (radius / 5) * level;
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = center.x + r * Math.cos(angle);
      const y = center.y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 绘制轴线
  for (let i = 0; i < count; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 绘制数据区域（半透明填充 + 发光描边）
  ctx.beginPath();
  indicators.forEach((item, i) => {
    const ratio = Math.min(item.value / 100, 1);
    const r = radius * ratio;
    const angle = i * angleStep - Math.PI / 2;
    const x = center.x + r * Math.cos(angle);
    const y = center.y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = colors.fill;
  ctx.fill();
  // 外发光描边
  ctx.shadowColor = colors.stroke;
  ctx.shadowBlur = 10;
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 绘制数据点（带白色边框的实心圆）
  indicators.forEach((item, i) => {
    const ratio = Math.min(item.value / 100, 1);
    const r = radius * ratio;
    const angle = i * angleStep - Math.PI / 2;
    const x = center.x + r * Math.cos(angle);
    const y = center.y + r * Math.sin(angle);

    // 外圈光晕
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = colors.stroke + '33';
    ctx.fill();

    // 白边实心点
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = colors.stroke;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 标签旁显示数值
    const valAngle = angle;
    const valR = r + 18;
    const valX = center.x + valR * Math.cos(valAngle);
    const valY = center.y + valR * Math.sin(valAngle);
    ctx.fillStyle = colors.stroke;
    ctx.font = 'bold 11px PingFang SC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.value.toString(), valX, valY);
  });

  // 绘制维度标签（圆外侧，更远的距离）
  ctx.fillStyle = colors.text;
  ctx.font = 'bold 13px PingFang SC';
  indicators.forEach((item, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const labelR = radius + 42;
    const x = center.x + labelR * Math.cos(angle);
    const y = center.y + labelR * Math.sin(angle);
    if (Math.abs(Math.cos(angle)) < 0.01) {
      ctx.textAlign = 'center';
    } else if (Math.cos(angle) > 0) {
      ctx.textAlign = 'left';
    } else {
      ctx.textAlign = 'right';
    }
    ctx.textBaseline = 'middle';
    ctx.fillText(item.name, x, y);
  });

  // 绘制中心分数区（圆角背景 + 分层文字）
  if (options.score !== undefined) {
    const badgeR = 34;
    // 白色圆底
    ctx.beginPath();
    ctx.arc(center.x, center.y, badgeR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fill();
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 分数（大）
    ctx.fillStyle = colors.stroke;
    ctx.font = 'bold 26px PingFang SC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(options.score, center.x, center.y + 2);

    // 分割线
    ctx.beginPath();
    ctx.moveTo(center.x - 18, center.y + 6);
    ctx.lineTo(center.x + 18, center.y + 6);
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.stroke();

    // 综合评分（小）
    ctx.fillStyle = '#8C8C8C';
    ctx.font = '11px PingFang SC';
    ctx.textBaseline = 'top';
    ctx.fillText('综合评分', center.x, center.y + 10);
  }
}

/**
 * 绘制饼图 / 环形图
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} options - { center: {x, y}, radius: number, innerRadius: number (0=饼图), data: [{name, value, color}] }
 */
function drawPieChart(ctx, options) {
  const {
    center = { x: 150, y: 150 },
    radius = 100,
    innerRadius = 0, // 0 = 饼图，>0 = 环形图
    data = [],
    showLabels = true,
    colors = {
      text: '#1A1A2E',
      line: '#CCCCCC'
    }
  } = options;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = -Math.PI / 2;

  data.forEach((item, i) => {
    const sliceAngle = (item.value / total) * Math.PI * 2;
    const midAngle = startAngle + sliceAngle / 2;

    // 绘制扇形
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.arc(center.x, center.y, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = item.color || `hsl(${i * 60}, 70%, 60%)`;
    ctx.fill();

    // 绘制标签
    if (showLabels && item.value / total > 0.05) {
      const labelR = radius + 20;
      const labelX = center.x + labelR * Math.cos(midAngle);
      const labelY = center.y + labelR * Math.sin(midAngle);
      const pct = Math.round(item.value / total * 100);

      ctx.fillStyle = colors.text;
      ctx.font = '11px PingFang SC';
      ctx.textAlign = Math.cos(midAngle) > 0 ? 'left' : 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.name} ${pct}%`, labelX, labelY);
    }

    startAngle += sliceAngle;
  });

  // 绘制环形图空心
  if (innerRadius > 0) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }
}

/**
 * 绘制条形图（横向）
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} options - { data: [{name, value, color}], maxValue: number, barHeight: number, gap: number }
 */
function drawBarChart(ctx, options) {
  const {
    data = [],
    maxValue = 100,
    barHeight = 24,
    gap = 16,
    colors = {
      bar: '#1A6DFF',
      text: '#1A1A2E',
      grid: '#F0F0F0'
    }
  } = options;

  const startX = 100;
  const chartWidth = 250;

  data.forEach((item, i) => {
    const y = i * (barHeight + gap) + 40;
    const barWidth = (item.value / maxValue) * chartWidth;

    // 绘制标签
    ctx.fillStyle = colors.text;
    ctx.font = '12px PingFang SC';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.name, startX - 10, y + barHeight / 2);

    // 绘制背景条
    ctx.fillStyle = colors.grid;
    ctx.fillRect(startX, y, chartWidth, barHeight);

    // 绘制数据条
    ctx.fillStyle = item.color || colors.bar;
    ctx.fillRect(startX, y, barWidth, barHeight);

    // 绘制数值
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'left';
    ctx.fillText(item.value.toString(), startX + barWidth + 8, y + barHeight / 2);
  });
}

/**
 * 绘制漏斗图
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} options - { data: [{name, value, color}], width: number, height: number }
 */
function drawFunnelChart(ctx, options) {
  const {
    data = [],
    width = 300,
    height = 200,
    colors = {
      text: '#FFFFFF'
    }
  } = options;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const maxWidth = width * 0.9;
  const minWidth = width * 0.3;
  const itemHeight = height / data.length;

  data.forEach((item, i) => {
    const ratio = item.value / total;
    const currentWidth = minWidth + (maxWidth - minWidth) * (data[0].value > 0 ? item.value / data[0].value : 0);
    const x = (width - currentWidth) / 2;
    const y = i * itemHeight;

    // 绘制梯形（用三角形模拟漏斗）
    ctx.fillStyle = item.color || `hsl(${i * 60}, 70%, 60%)`;
    ctx.fillRect(x, y, currentWidth, itemHeight - 2);

    // 绘制文字
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 14px PingFang SC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${item.name} ${item.value}%`, width / 2, y + itemHeight / 2);
  });
}

/**
 * 绘制散点图（商圈距离 vs 人口）
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} options - { data: [{name, distance, population, color}], width, height, xLabel, yLabel }
 */
function drawScatterChart(ctx, options) {
  const {
    data = [],
    width = 300,
    height = 200,
    xLabel = '',
    yLabel = '',
    colors = { text: '#1A1A2E', grid: '#F0F0F0', axis: '#CCCCCC' }
  } = options;

  const padding = { top: 36, right: 36, bottom: 68, left: 68 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxDist = Math.max(...data.map(d => d.distance)) * 1.25 || 60;
  const maxPop  = Math.max(...data.map(d => d.population)) * 1.25 || 40;

  // 网格线 + Y轴刻度
  const ySteps = 5;
  for (let i = 0; i <= ySteps; i++) {
    const y = padding.top + chartH - (i / ySteps) * chartH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartW, y);
    ctx.strokeStyle = i === 0 ? colors.axis : colors.grid;
    ctx.lineWidth = i === 0 ? 2 : 1;
    ctx.stroke();

    ctx.fillStyle = colors.text;
    ctx.font = 'bold 13px PingFang SC';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round((maxPop / ySteps) * i).toString(), padding.left - 12, y);
  }

  // X轴刻度
  const xSteps = 5;
  for (let i = 0; i <= xSteps; i++) {
    const x = padding.left + (i / xSteps) * chartW;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + chartH);
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = colors.text;
    ctx.font = 'bold 13px PingFang SC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(Math.round((maxDist / xSteps) * i).toString(), x, padding.top + chartH + 10);
  }

  // 轴标签
  ctx.fillStyle = colors.text;
  ctx.font = 'bold 14px PingFang SC';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(xLabel, padding.left + chartW / 2, padding.top + chartH + 38);

  ctx.save();
  ctx.translate(18, padding.top + chartH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = colors.text;
  ctx.font = 'bold 14px PingFang SC';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();

  // 画散点 + 标签
  data.forEach((item, i) => {
    const x = padding.left + (item.distance / maxDist) * chartW;
    const y = padding.top + chartH - (item.population / maxPop) * chartH;
    const radius = 26 + i * 6; // 气泡更大：26, 32, 38

    // 外发光阴影
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = item.color + '22';
    ctx.fill();

    // 阴影
    ctx.beginPath();
    ctx.arc(x + 3, y + 3, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fill();

    // 圆点底色（纯色，确保文字可读）
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = item.color;
    ctx.fill();

    // 顶部高光（立体感）
    const grad = ctx.createRadialGradient(x - radius/4, y - radius/4, 2, x, y, radius);
    grad.addColorStop(0, 'rgba(255,255,255,0.35)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.05)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // 白色描边
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 名称标签（加粗加大）
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px PingFang SC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // 文字阴影增强可读性
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    ctx.fillText(item.name, x, y - 7);

    // 人口标签
    ctx.font = 'bold 13px PingFang SC';
    ctx.fillText(item.population + '万人', x, y + 11);

    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  });
}

// 辅助：颜色加亮
function lighten(color, amount) {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xFF) + amount);
  const b = Math.min(255, (num & 0xFF) + amount);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

/**
 * 绘制垂直柱状图
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} options - { data: [{name, value, color}], width, height, maxValue }
 */
function drawColumnChart(ctx, options) {
  const {
    data = [],
    width = 300,
    height = 200,
    maxValue = 10,
    colors = {
      text: '#1A1A2E',
      grid: '#F0F0F0',
      axis: '#CCCCCC'
    }
  } = options;

  const padding = { top: 30, right: 20, bottom: 50, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const barWidth = Math.min((chartW / data.length) * 0.6, 40);
  const gap = (chartW - barWidth * data.length) / (data.length + 1);

  // 绘制网格线（Y轴）
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const y = padding.top + chartH - (i / steps) * chartH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartW, y);
    ctx.strokeStyle = i === 0 ? colors.axis : colors.grid;
    ctx.lineWidth = i === 0 ? 1.5 : 1;
    ctx.stroke();

    // Y轴标签
    ctx.fillStyle = colors.text;
    ctx.font = '11px PingFang SC';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round((maxValue / steps) * i).toString(), padding.left - 8, y);
  }

  // 绘制柱子
  data.forEach((item, i) => {
    const x = padding.left + gap + i * (barWidth + gap);
    const barH = (item.value / maxValue) * chartH;
    const y = padding.top + chartH - barH;

    // 柱子阴影
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(x + 2, y + 2, barWidth, barH);

    // 柱子主体（渐变色）
    const gradient = ctx.createLinearGradient(x, y + barH, x, y);
    gradient.addColorStop(0, item.color || '#1A6DFF');
    gradient.addColorStop(1, adjustColor(item.color || '#1A6DFF', 30));
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barH);

    // 柱子顶部高光
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(x, y, barWidth, 3);

    // 数值标签
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 13px PingFang SC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(item.value.toString(), x + barWidth / 2, y - 6);

    // X轴标签
    ctx.fillStyle = colors.text;
    ctx.font = '12px PingFang SC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(item.name, x + barWidth / 2, padding.top + chartH + 10);
  });

  // Y轴标题
  ctx.save();
  ctx.translate(14, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = colors.text;
  ctx.font = '12px PingFang SC';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('政策数量（条）', 0, 0);
  ctx.restore();
}

// 辅助：颜色提亮
function adjustColor(color, amount) {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
  const b = Math.min(255, (num & 0x0000FF) + amount);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

/**
 * 绘制同心圆（商圈分布）
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} options - { circles: [{name, value, color, radius}], center: {x, y} }
 */
function drawConcentricCircles(ctx, options) {
  const {
    circles = [],
    center = { x: 150, y: 150 },
    colors = {
      text: '#FFFFFF',
      border: '#FFFFFF'
    }
  } = options;

  // 从外到内绘制
  [...circles].reverse().forEach((circle, i) => {
    ctx.beginPath();
    ctx.arc(center.x, center.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.globalAlpha = 1;

    // 绘制边框
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制文字
    const labelR = circle.radius * 0.6;
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 12px PingFang SC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(circle.name, center.x, center.y - 8);
    ctx.font = '11px PingFang SC';
    ctx.fillText(circle.value, center.x, center.y + 10);
  });

  // 绘制中心点
  ctx.beginPath();
  ctx.arc(center.x, center.y, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#1A1A2E';
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 10px PingFang SC';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('地块', center.x, center.y);
}

/**
 * 绘制堆叠条形图（政策层级）
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} options - { data: [{name, count, color}], maxCount: number }
 */
function drawStackedBarChart(ctx, options) {
  const {
    data = [],
    maxCount = 10,
    colors = {
      text: '#1A1A2E',
      grid: '#F0F0F0'
    }
  } = options;

  const startX = 100;
  const chartWidth = 250;
  const barHeight = 30;
  const gap = 20;

  data.forEach((item, i) => {
    const y = i * (barHeight + gap) + 40;
    const itemValue = item.count !== undefined ? item.count : (item.value || 0);
    const barWidth = (itemValue / maxCount) * chartWidth;

    // 标签
    ctx.fillStyle = colors.text;
    ctx.font = '13px PingFang SC';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.name, startX - 10, y + barHeight / 2);

    // 背景
    ctx.fillStyle = colors.grid;
    ctx.fillRect(startX, y, chartWidth, barHeight);

    // 数据条
    ctx.fillStyle = item.color || '#1A6DFF';
    ctx.fillRect(startX, y, barWidth, barHeight);

    // 数值
    ctx.font = 'bold 13px PingFang SC';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    if (barWidth > 50) {
      // 条够宽，文字放条内（白色）
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`${itemValue}项`, startX + 10, y + barHeight / 2);
    } else {
      // 条太窄，文字放条右侧（深色）
      ctx.fillStyle = colors.text;
      ctx.fillText(`${itemValue}项`, startX + barWidth + 8, y + barHeight / 2);
    }
  });
}

module.exports = {
  getCanvasContext,
  drawRadarChart,
  drawPieChart,
  drawBarChart,
  drawColumnChart,
  drawScatterChart,
  drawFunnelChart,
  drawConcentricCircles,
  drawStackedBarChart
};
