import shttp from '../utils/shttp.js'

function boot() {
  return shttp({
    url: '/api/v1/public/boot/demo'
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
}

export default apis;