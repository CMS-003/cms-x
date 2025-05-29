import qs from 'qs';
import shttp from '../utils/shttp.js'

function boot() {
  return shttp({
    url: '/api/v1/public/boot/' + APP
  })
}

function getTemplate(id) {
  return shttp({
    url: `/api/v1/public/page/${id}`,
  });
}

function getPageComponents(id, page = 1, size = 8) {
  return shttp({
    url: `/api/v1/public/page/${id}/components?page=${page}&size=${size}`,
  });
}

function getResourceDetail(id) {
  return shttp({
    url: `/api/v1/public/resource/${id}`,
  });
}

function getResourceList(query) {
  return shttp({
    url: `/api/v1/public/${APP}/resources${qs.stringify(query, { addQueryPrefix: true })}`,
  });
}

function fetchAPI(method, url, data) {
  return shttp({
    method,
    url: url,
    data,
  })
}

function signIn(data) {
  return shttp({
    method: 'post',
    data,
    url: `/api/v1/oauth/sign-in`
  })
}

function getProfile() {
  return shttp({
    url: `/api/v1/users/profile`
  })
}

function getApi(rawUrl, additionalQuery) {
  // 判断是否为完整 URL（包含协议）
  const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(rawUrl);

  // 构造 URL 对象：相对路径需要提供一个 base（location.href 可用）
  const base = window.location.origin;
  const url = hasProtocol ? new URL(rawUrl) : new URL(rawUrl, base);

  // 合并 query 参数
  const params = new URLSearchParams(url.search);
  for (const [key, value] of Object.entries(additionalQuery)) {
    params.set(key, value); // 会覆盖已有 key
  }

  url.search = params.toString();

  // 返回
  return hasProtocol
    ? url.toString()                         // 完整 URL：返回完整的带 host 的 URL
    : url.pathname + url.search;            // 相对路径：去掉 host，只保留路径和 query
}

const apis = {
  getApi,
  boot,
  getTemplate,
  getPageComponents,
  async refresh() {
    return shttp({
      url: '/v1/auth/refresh'
    })
  },
  getResourceDetail,
  getResourceList,
  fetchAPI,
  signIn,
  getProfile,
}

export default apis;