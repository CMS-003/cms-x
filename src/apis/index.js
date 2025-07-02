import qs from 'qs';
import shttp from '../utils/shttp.js'

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

function boot() {
  return shttp({
    url: '/gw/api/v1/public/boot/' + APP
  })
}

function getTemplate(id) {
  return shttp({
    url: `/gw/api/v1/public/page/${id}`,
  });
}

function getPageComponents(id, page = 1, size = 8) {
  return shttp({
    url: `/gw/api/v1/public/page/${id}/components?page=${page}&size=${size}`,
  });
}

function getResourceDetail(id) {
  return shttp({
    url: `/gw/api/v1/public/resource/${id}`,
  });
}

function getResourceList(query) {
  return shttp({
    url: `/gw/api/v1/public/${APP}/resources${qs.stringify(query, { addQueryPrefix: true })}`,
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
    url: `/gw/user/oauth/sign-in`
  })
}

function signOut(data) {
  return shttp({
    method: 'post',
    data,
    url: `/gw/user/oauth/sign-out`
  })
}

function getProfile() {
  return shttp({
    url: `/gw/user/profile`
  })
}

function getChatDetail(id) {
  return shttp({
    url: '/gw/message/chats/' + id
  })
}

function getMessages(id, query) {
  return shttp({
    url: `/gw/message/chats/${id}/messages${qs.stringify(query, { addQueryPrefix: true })}`
  })
}

function readAll(id) {
  return shttp({
    method: 'post',
    url: `/gw/message/chats/${id}/read`
  })
}

function sendMessage(data) {
  return shttp({
    method: 'post',
    url: `/gw/message/chats/${data.chat_id}/messages`,
    data
  })
}

async function toggleFollow(follow, user_id) {
  try {
    follow ? await shttp.delete(`/gw/user/interaction/follow/${user_id}`) : await shttp.post(`/gw/user/interaction/follow/${user_id}`)
  } catch (e) {

  }
}

const apis = {
  getApi,
  boot,
  getTemplate,
  getPageComponents,
  async refresh() {
    return shttp({
      url: '/gw/user/oauth/refresh'
    })
  },
  getResourceDetail,
  getResourceList,
  fetchAPI,
  signIn,
  signOut,
  getProfile,
  getChatDetail,
  readAll,
  getMessages,
  sendMessage,
  toggleFollow,
}

export default apis;