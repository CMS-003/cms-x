import storage from '@/utils/storage.js';
import { types } from 'mobx-state-tree';

const User = types.model('user', {
  access_token: types.optional(types.string, ''),
  refresh_token: types.optional(types.string, ''),
  info: types.frozen({}),
})
  .actions(self => ({
    logout() {
      self.access_token = ''
      self.refresh_token = ''
    },
    setAccessToken(token) {
      self.access_token = token
      storage.setValue('access_token', token)
    },
    setRefreshToken(token) {
      self.refresh_token = token
      storage.setValue('refresh_token', token)
    },
    setInfo(info) {
      self.info = info
    },
  }))
  .views(self => ({
    get isLogin() {
      return self.access_token && self.refresh_token && self.info._id
    }
  }));

export default User;