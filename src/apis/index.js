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

function getPageComponents(id, page = 1) {
  return shttp({
    url: `/api/v1/public/page/${id}/components?page=${page}`,
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

const apis = {
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
}

export default apis;