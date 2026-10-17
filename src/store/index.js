import { types } from 'mobx-state-tree';
import User from './user';
import App from './app'
import Template from './template'
import storage from '../utils/storage';

storage.prefix = `${App}_`

const Store = types.model('store', {
  app: App,
  user: User,
  templates: types.map(Template)
  // view: View,
}).actions(self => ({
  setTemplate(id, data) {
    self.templates.set(id, data)
  }
}))

const store = Store.create({
  app: {
    debug: true,
    baseURL: '',
    orientation: window.orientation,
    direction: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
  },
  user: {
    access_token: storage.getValue('access_token') || '',
    refresh_token: storage.getValue('refresh_token') || '',
  },
  templates: {}
});

export default store;