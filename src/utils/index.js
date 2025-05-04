import * as bowser from 'bowser';

export const browser = bowser.getParser(window.navigator.userAgent);

export function formatDuration(n) {
  let time = '',
    h = 0,
    m = 0,
    s = 0;
  n = typeof n === 'number' ? n.toFixed(0) : 0;
  if (n > 3600) {
    h = (n / 3600).toFixed(0);
    if (h < 10) {
      h = '0' + h;
    }
    n = n % 3600;
  }
  m = (n / 60).toFixed(0);
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
