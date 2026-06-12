// utils/chart-radar.js
// TODO: 预留官方API接口，未来替换此处即可接入真实数据
// Canvas 2D 雷达图绘制工具（纯前端，无依赖）

/**
 * 绘制雷达图
 * @param {Object} opts
 * @param {CanvasRenderingContext2D} opts.ctx - Canvas 2D 上下文
 * @param {number} opts.width - Canvas 宽度（px）
 * @param {number} opts.height - Canvas 高度（px）
 * @param {Array} opts.dimensions - [{ name, max, value, color }]
 * @param {string} [opts.centerText] - 中心文字（如"综合得分 69"）
 * @param {number} [opts.dpr=2] - 设备像素比
 */
function drawRadar(opts) {
  var ctx = opts.ctx;
  var W = opts.width;
  var H = opts.height;
  var dimensions = opts.dimensions || [];
  var centerText = opts.centerText || '';
  var dpr = opts.dpr || 2;

  if (!ctx || dimensions.length === 0) return;

  var cx = W / 2;
  var cy = H / 2;
  var maxR = Math.min(W, H) * 0.32;

  // 清空画布
  ctx.clearRect(0, 0, W, H);

  // ==================== 绘制同心多边形网格 ====================
  var levels = 5;
  for (var L = levels; L >= 1; L--) {
    var r = maxR * L / levels;
    ctx.beginPath();
    for (var i = 0; i < dimensions.length; i++) {
      var angle = Math.PI * 2 * i / dimensions.length - Math.PI / 2;
      var x = cx + r * Math.cos(angle);
      var y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(26, 109, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 填充最外层
    if (L === levels) {
      ctx.fillStyle = 'rgba(26, 109, 255, 0.03)';
      ctx.fill();
    }
  }

  // ==================== 绘制轴线 ====================
  for (var i = 0; i < dimensions.length; i++) {
    var angle = Math.PI * 2 * i / dimensions.length - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
    ctx.strokeStyle = 'rgba(26, 109, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // ==================== 绘制数据区 ====================
  ctx.beginPath();
  for (var i = 0; i < dimensions.length; i++) {
    var dim = dimensions[i];
    var ratio = Math.min(dim.value / dim.max, 1);
    var r = maxR * ratio;
    var angle = Math.PI * 2 * i / dimensions.length - Math.PI / 2;
    var x = cx + r * Math.cos(angle);
    var y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(26, 109, 255, 0.18)';
  ctx.fill();
  ctx.strokeStyle = '#1A6DFF';
  ctx.lineWidth = 2;
  ctx.stroke();

  // ==================== 数据点 ====================
  for (var i = 0; i < dimensions.length; i++) {
    var dim = dimensions[i];
    var ratio = Math.min(dim.value / dim.max, 1);
    var r = maxR * ratio;
    var angle = Math.PI * 2 * i / dimensions.length - Math.PI / 2;
    var x = cx + r * Math.cos(angle);
    var y = cy + r * Math.sin(angle);

    // 外圈白底
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = dim.color || '#1A6DFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 内圈色块
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = dim.color || '#1A6DFF';
    ctx.fill();
  }

  // ==================== 维度标签 ====================
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (var i = 0; i < dimensions.length; i++) {
    var dim = dimensions[i];
    var angle = Math.PI * 2 * i / dimensions.length - Math.PI / 2;
    var labelR = maxR + 36;
    var x = cx + labelR * Math.cos(angle);
    var y = cy + labelR * Math.sin(angle);

    // 标签背景
    var text = dim.name;
    var tw = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(x - tw / 2 - 6, y - 12, tw + 12, 24);

    ctx.fillStyle = dim.color || '#1A1A2E';
    ctx.fillText(text, x, y);
  }

  // ==================== 中心文字 ====================
  if (centerText) {
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1A6DFF';
    ctx.fillText(centerText, cx, cy);
  }
}

module.exports = {
  drawRadar: drawRadar
};
