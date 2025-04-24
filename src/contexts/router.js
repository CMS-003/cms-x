import React from 'react'

import { types } from 'mobx-state-tree';
import Dynamic from '../templates/dynamic'
import Article from '../templates/article'
import Video from '../templates/video'
import Gallery from '../templates/gallery'
import _ from 'lodash'

/**
 * 每个 view 由Template组成,界面显示由 view 控制
 * 监听 history 变化并修改 view,view 变化会修改 history
 * 缓存 Template 通过 id 判断实例
 */
const Templates = {
  Dynamic,
  Article,
  Video,
  Gallery,
}
const ViewPages = {

}

export function getViews(location) {
  let pathname = location.pathname;
  const views = pathname.split('/').filter(p => p !== '');
  const query = {};
  (location.search.replace(/^[?]/, '')).split('&').map(v => {
    const [name, value] = v.split('=');
    _.set(query, name, value);
  });
  return views.map(view => ({ view, query: query[view] || {} }));
}

const View = types
  .model('views', {
    views: types.array(types.model('view', {
      view: types.string,
      query: types.frozen({}),
    })),
  })
  .actions(self => ({
    setViews(views) {
      self.views = views;
    },
    pushView(view, query = {}) {
      self.views.push({ view, query })
      const url = self.getUrl();
      window.history.pushState(null, '', url)
    },
    backView() {
      self.views.pop();
      const url = self.getUrl();
      window.history.pushState(null, '', url)
    },
  }))
  .views(self => ({
    getUrl() {
      const queries = [];
      const views = self.views.map(v => {
        if (v.query) {
          for (let k in v.query) {
            _.set(queries, `${v.view}.${k}`, v.query[k]);
            queries.push(`${v.view}.${k}=${v.query[k]}`);
          }
        }
        return v.view;
      });
      return `/${views.join('/')}${queries.length ? '?' + queries.join('&') : ''}`
    },
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

const RouterContext = React.createContext(View.create({ views: [] }));

export default RouterContext