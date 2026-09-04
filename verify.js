const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'index.html');
const html = fs.readFileSync(file, 'utf8');

const errors = [];
const warnings = [];

// 1. 基本结构
const checks = [
  ['<!DOCTYPE html>', /<!DOCTYPE html>/i],
  ['<canvas id="game">', /<canvas id="game"/i],
  ['script 标签', /<script>[\s\S]*?<\/script>/i],
  ['requestAnimationFrame 主循环', /requestAnimationFrame\(loop\)/],
  ['update 函数', /function update\(dt\)/],
  ['gameOver 函数', /function gameOver/],
  ['碰撞检测', /gameOver/.test(html) && /dx \* dx \+ dy \* dy/.test(html)],
  ['localStorage 最高分', /localStorage/],
  ['触摸事件', /touchmove|touchstart/],
  ['开始游戏按钮', /startBtn/],
];

checks.forEach(([name, ok]) => {
  if (!ok) errors.push('缺失: ' + name);
});

// 2. 提取 script 内容做 JS 语法检查
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  const js = scriptMatch[1];
  const tmp = path.join(__dirname, '__check.js');
  fs.writeFileSync(tmp, js);
  try {
    // node --check 只做语法检查不执行
    require('child_process').execSync(`node --check "${tmp}"`, { stdio: 'pipe' });
    console.log('✅ JS 语法检查通过 (node --check)');
  } catch (e) {
    errors.push('JS 语法错误:\n' + e.stderr.toString());
  } finally {
    fs.unlinkSync(tmp);
  }
}

// 3. 标签平衡（粗略）
const opens = (html.match(/<canvas/g) || []).length;
const closes = (html.match(/<\/canvas>/g) || []).length;
if (opens !== closes) warnings.push(`canvas 标签未闭合: ${opens} vs ${closes}`);

console.log('\n=== 错误 ===');
if (errors.length === 0) console.log('无');
else errors.forEach(e => console.log('❌ ' + e));

console.log('\n=== 警告 ===');
if (warnings.length === 0) console.log('无');
else warnings.forEach(w => console.log('⚠️ ' + w));

console.log('\n文件大小:', (html.length / 1024).toFixed(1), 'KB');
