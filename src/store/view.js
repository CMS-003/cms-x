import { types } from 'mobx-state-tree';

const View = types
  .model('views', {
    views: types.array(types.model('view', {
      view: types.string,
      query: types.frozen({}),
    })),
    current: types.optional(types.string, '/')
  })
  .actions(self => ({
    pushView(view, query = {}) {
      self.views.push({ view, query })
      self.current = view
    },
    backView() {
      if (self.views.length === 1) {
        return;
      } else {
        self.views.pop();
        self.current = self.views[self.views.length - 1]
      }
    }
  }))
  .views(self => ({

  }));

export default View;