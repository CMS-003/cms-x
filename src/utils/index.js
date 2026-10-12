import Bowser from 'bowser';
import { get, set } from 'lodash';

export { default as shttp } from './shttp.js'
export { default as storage } from './storage.js'

export const browser = Bowser.getParser(window.navigator.userAgent);

export function formatDuration(n) {
  let time = '',
    h = 0,
    m = 0,
    s = 0;
  n = typeof n === 'number' ? Math.round(n) : 0;
  if (n > 3600) {
    h = Math.floor(n / 3600)
    if (h < 10) {
      h = '0' + h;
    }
    n = n % 3600;
  }
  m = Math.floor(n / 60);
  if (m < 10) {
    m = '0' + m;
  }
  s = n % 60;
  if (s < 10) {
    s = '0' + s;
  }
  if (h) {
    return `${h}:${m}:${s}`;
  } else {
    return `${m}:${s}`;
  }
}

// 人性化时间
export function readableTime(date) {
  const ts = Date.now();
  const duration = ts - date.getTime();
  let tips = '',
    suffix = duration > 0 ? '前' : '后';
  let year = 24 * 60 * 60 * 1000 * 365,
    month = 24 * 60 * 60 * 1000 * 30,
    day = 24 * 60 * 60 * 1000,
    hour = 60 * 60 * 1000,
    minute = 60 * 1000;
  if (duration >= year) {
    tips = Math.floor(duration / year) + '年';
  } else if (duration >= month) {
    tips = Math.floor(duration / month) + '月';
  } else if (duration >= day) {
    tips = Math.floor(duration / day) + '天';
  } else if (duration >= hour && duration < day) {
    tips = Math.floor(duration / hour) + '小时';
  } else if (duration > minute && duration < hour) {
    tips = Math.floor(duration / minute) + '分钟';
  } else {
    tips = '刚刚';
    suffix = '';
  }
  return tips + suffix;
}

export function isPWAorMobile() {
  const isChromeApp = window.matchMedia('(display-mode: standalone)').matches;
  const isIosApp = window.navigator.standalone === true;
  const platformType = browser.getPlatformType();
  return platformType === 'mobile' ||
    platformType === 'tablet' ||
    isChromeApp ||
    isIosApp
    ? true
    : false;
}

export function isPWA() {
  const isChromeApp = window.matchMedia('(display-mode: standalone)').matches;
  const isIosApp = window.navigator.standalone === true;
  return isChromeApp || isIosApp;
}

export function isLandscape() {
  return ['tablet', 'mobile', 'desktop'].includes(browser.getPlatformType()) && window.innerWidth > window.innerHeight
}

/**
 * 按组件节点 widget.mapping 把第三方接口的原始响应映射为内部统一结构。
 *
 * 语法：
 * - key 支持点路径，会自动拼成嵌套结构：'data.items' => { data: { items: ... } }
 * - 值为 `$` 开头的字符串时表示“取原始响应里的字段”，后面接 lodash 路径：
 *   `$data.resources` => get(raw, 'data.resources')；`$list.0.id` 亦可。
 *   仅当值恰好是 `$`（后面为空）时才表示整个原始响应体。
 * - 值不是 `$` 字符串时一律视为定值：{ code: 0 } => { code: 0 }
 * - 值本身是对象时递归映射（等价于用点路径展开的写法）
 *
 * 例（body 为数组，接口形如 { data: { resources: [...] } }）：
 *   { code: 0, 'data.items': '$data.resources' }
 *   => { code: 0, data: { items: [...] } }
 *
 * 例（接口形如 { resources: { items, size } }）：
 *   { code: 0, data: '$resources' }
 *   => { code: 0, data: { items, size } }
 *
 * @param {object} raw 第三方接口的原始响应
 * @param {object} mapping 组件节点的 widget.mapping
 * @returns {object} 映射后的结果；raw 或 mapping 为空时原样返回 raw，保证未配置映射的节点行为不变
 */
export function mapFields(raw, mapping) {
  if (!raw || !mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
    return raw;
  }
  const result = {};
  Object.entries(mapping).forEach(([key, rule]) => {
    let value;
    if (typeof rule === 'string' && rule.startsWith('$')) {
      // 仅 `$` 表示整个 body；`$a.b.c` 表示取原始响应里的字段
      value = rule === '$' ? raw : get(raw, rule.slice(1));
    } else if (rule && typeof rule === 'object' && !Array.isArray(rule)) {
      // 值本身是对象时递归映射
      value = mapFields(raw, rule);
    } else {
      // 其他一律视为定值
      value = rule;
    }
    // key 支持点路径：'data.items' => { data: { items: value } }
    set(result, key, value);
  });
  return result;
}