import { isLandscape } from '@/utils';
import { types } from 'mobx-state-tree';

const Line = types.model('line', {
  name: types.string,
  type: types.string,
  url: types.string,
});

const App = types
  .model('app', {
    t: types.optional(types.number, 0),
    isBooting: types.optional(types.boolean, true),
    debug: types.optional(types.boolean, false),
    fullscreen: types.optional(types.boolean, false),
    direction: types.enumeration(['landscape', 'portrait']),
    orientation: types.optional(types.number, 0),
    baseURL: types.optional(types.string, '/'),
    storagePrefix: types.optional(types.string, 'novel_'),
    lines: types.array(Line),
  })
  .actions(self => ({
    setBaseURL(url) {
      self.baseURL = url;
    },
    setBoot(b) {
      self.isBooting = b
    },
    setDirection(direction) {
      self.direction = direction;
    },
    setOrientation(angel) {
      self.orientation = angel
    },
  }))
  .views(self => ({
    get imageLine() {
      return '';
    },
    get videoLine() {
      return '';
    },
  }));

export default App;