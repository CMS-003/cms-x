import { Observer, useLocalObservable, } from "mobx-react-lite";
import { PullToRefresh, List, InfiniteScroll } from 'antd-mobile'
import Widgets from './index.js'
import { action, runInAction, toJS } from "mobx";
import apis from "@/apis/index.js";
import { get } from "lodash";

export function Component({ self }) {
  const Widget = Widgets[self.type];
  if (!Widget) {
    return <div>NotFound: {self.type}</div>
  }
  return <Observer>{() => (
    <Widget self={self} >
      {self.children.map(child => (
        <Component key={child._id} self={child} />
      ))}
    </Widget>
  )}</Observer>
}

export default function Auto({ template }) {
  const local = useLocalObservable(() => ({
    components: template.children,
    ended: false,
    infinite: get(template, 'attrs.pagination', 0),
    page: 1,
    onRefresh: async () => {
      local.page = 1;
      local.ended = false;
      const resp = await apis.getPageComponents(template._id, local.page)
      if (resp.code === 0) {
        runInAction(() => {
          local.components = [];
        })
        local.setData(resp.data.items, typeof resp.data.ended === 'boolean' ? resp.data.ended : true)
      }
    },
    loadMore: action(async () => {
      if (local.ended) return;
      local.page++;
      const resp = await apis.getPageComponents(template._id, local.page)
      if (resp.code === 0) {
        local.setData(resp.data.items, typeof resp.data.ended === 'boolean' ? resp.data.ended : true)
      }
    }),
    setData(components, ended) {
      local.components.push(...components);
      local.ended = ended;
    }
  }));
  return <Observer>{() => (
    <div style={toJS(template.style)} data-tid={template._id}>
      {local.infinite
        ? <PullToRefresh onRefresh={local.onRefresh}>
          <List style={{
            "--border-top": "none",
            "--border-bottom": "none",
            "--padding-left": 0,
            "--padding-right": 0,
            "--border-inner": "none",
            "--adm-color-background": "transparent",
            overflowX: 'hidden'
          }}>
            {local.components.map((component, i) => (
              <List.Item key={i}>
                <Component key={component._id} self={component} />
              </List.Item>
            ))}
          </List>
          <InfiniteScroll loadMore={local.loadMore} hasMore={!local.ended} threshold={10} />
        </PullToRefresh>
        : local.components.map(component => <Component key={component._id} self={component} />)
      }
    </div>
  )}</Observer>
}