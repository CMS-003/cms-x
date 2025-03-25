import { shttp } from '../utils'

function boot() {
  return shttp({
    url: '/api/v1/public/boot/demo'
  })
}
function getPageComponents(id, page = 1) {
  return shttp({
    url: `/api/v1/public/page/${id}/components?page=${page}`,
  });
}

const apis = {
  boot,
  getPageComponents,
  async refresh() {
    return shttp({
      url: '/v1/auth/refresh'
    })
  },
}

export default apis;