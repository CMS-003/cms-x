import { shttp } from '../utils'

function getPageComponents() {
  return shttp({
    url: '/v1/public/boot',
  });
}

const apis = {
  getPageComponents,
}

export default apis;