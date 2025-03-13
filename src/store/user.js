import { types } from 'mobx-state-tree';

const User = types.model('user', {
  access_token: types.optional(types.string, ''),
  refresh_token: types.optional(types.string, ''),
})
  .actions(self => ({
    logout() {
      self.access_token = ''
      self.refresh_token = ''
    },
    setAccessToken(token) {
      self.access_token = toekn
    },
  }))
  .views(self => ({
    get isLogin() {
      return self.access_token && self.refresh_token
    }
  }));

export default User;