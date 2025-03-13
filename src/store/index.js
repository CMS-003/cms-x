import { types } from 'mobx-state-tree';
import User from './user';
import App from './app'

const Store = types.model('store', {
  app: App,
  user: User,
})

const store = Store.create({});

export default store;