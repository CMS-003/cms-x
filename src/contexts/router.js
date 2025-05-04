import React from 'react'

import { types } from 'mobx-state-tree';
import Dynamic from '../templates/dynamic'
import Article from '../templates/article'
import Video from '../templates/video'
import Gallery from '../templates/gallery'
import Post from '../templates/post'
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
  Post,
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
      animate: types.optional(types.boolean, true),
      query: types.frozen({}),
    })),
    clicked: types.optional(types.boolean, false),
  })
  .actions(self => ({
    setViews(views) {
      self.views = views;
    },
    pop() {
      self.views.pop();
    },
    pushView(view, query = {}, animate = true) {
      self.clicked = true;
      self.views.push({ view, query, animate })
      const url = self.getUrl();
      window.history.pushState({ direction: 'forward' }, '', url)
      setTimeout(() => {
        self.setClicked(false)
      }, 100)
    },
    popView() {
      self.views[self.views.length - 1].animate = false;
      setTimeout(() => {
        self.pop();
      }, 0)
    },
    backView() {
      self.clicked = true;
      self.views.pop();
      window.history.back()
    },
    setClicked(b) {
      self.clicked = b;
    }
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