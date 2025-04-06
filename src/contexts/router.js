import React from 'react'

import { types } from 'mobx-state-tree';
import Dynamic from '../templates/dynamic'
import Article from '../templates/article'
import Video from '../templates/video'

/**
 * 每个 view 由Template组成,界面显示由 view 控制
 * 监听 history 变化并修改 view,view 变化会修改 history
 * 缓存 Template 通过 id 判断实例
 */
const Templates = {
  Dynamic,
  Article,
  Video,
}
const ViewPages = {

}

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
        self.current = self.views[self.views.length - 1].view
      }
    },
  }))
  .views(self => ({
    getViewPage(view, id) {
      const view_id = `${view}:${id}`
      console.log(view_id)
      if (ViewPages[view_id]) {
        return ViewPages[view_id]
      }
      if (Templates[view]) {
        const ViewPage = Templates[view];
        ViewPages[view_id] = ViewPage
        return ViewPages[view_id]
      }
      return () => <div>404</div>;
    }
  }));

export const router = View.create({
  views: [{ view: 'Dynamic', query: { id: 'demo' } }],
  current: 'Dynamic:demo'
})
const RouterContext = React.createContext(null);

export default RouterContext