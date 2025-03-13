import { types } from 'mobx-state-tree';

const App = types.model('app', {
  t: types.optional(types.number, 0),
  isBooting: types.optional(types.boolean, false),
  debug: types.optional(types.boolean, false),
  fullscreen: types.optional(types.boolean, false),
  orientation: types.optional(types.number, 0),
  baseURL: types.optional(types.string, '/'),
  storagePrefix: types.optional(types.string, 'novel_'),
})
  .actions(self => ({
    setBaseURL(url) {
      self.baseURL = url;
    },
    setBoot(b) {
      self.isBooting(b)
    },
  }));

export default App;