import { types } from 'mobx-state-tree';

const View = types
  .model('view', {
    views: types.array(types.string),
    current: types.optional(types.string, '/')
  })
  .actions(self => ({
    pushView(view) {
      self.views.push(view)
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