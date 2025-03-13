import { shttp } from '../utils'

function boot() {
  return shttp({
    url: '/v1/public/boot',
  });
}

export default {
  boot,
}
