import React from 'react'

import { set } from 'lodash'
import { types } from 'mobx-state-tree';
import Template from '@/templates/index.js';

const ViewPages = {

}

export function getViews(location) {
  let pathname = location.pathname;
  const views = pathname.split('/').filter(p => p !== '');
  const query = {};
  (location.search.replace(/^[?]/, '')).split('&').forEach(v => {
    const [name, value] = v.split('=');
    set(query, name, value);
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
            set(queries, `${v.view}.${k}`, v.query[k]);
            queries.push(`${v.view}.${k}=${v.query[k]}`);
          }
        }
        return v.view;
      });
      return `/${views.join('/')}${queries.length ? '?' + queries.join('&') : ''}`
    },
    getViewPage(view = 'dynamic', id = '') {
      const view_id = `${view}:${id}`
      if (ViewPages[view_id]) {
        return ViewPages[view_id]
      }
      ViewPages[view_id] = ({ active }) => <Template view={view} id={id} active={active} />
      return ViewPages[view_id]
    }
  }));

const RouterContext = React.createContext(View.create({ views: [] }));

export default RouterContext