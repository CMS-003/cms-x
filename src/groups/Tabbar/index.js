import React, { Fragment, useEffect } from 'react';
import { runInAction } from 'mobx';
import { Observer, useLocalObservable } from "mobx-react-lite";
import Template from '@/templates';
import { Acon, SafeArea, CenterXY } from '@/components';
import { Loading, TabBar } from "antd-mobile";

export function Hidden({ visible, children }) {
  return (
    <Observer>
      {() => {
        return <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '100%', overflow: 'hidden auto', visibility: visible ? 'visible' : 'hidden', zIndex: visible ? 2 : 1 }}>{children}</div>;
      }}
    </Observer>
  );
}



export default function TabBarPage({ self }) {
  const local = useLocalObservable(() => ({
    activeKey: self.children[0]._id,
    mount_ids: {},
    setMounted(id) {
      local.mount_ids[id] = true;
    }
  }));
  useEffect(() => {
    local.setMounted(local.activeKey)
  }, [local.activeKey, local.setMounted])
  return <Observer>{() => (
    <SafeArea>
      <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', overscrollBehavior: 'none' }}>
          {self.children.map(child => (
            <Fragment key={child._id}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '100%', overflow: 'hidden auto', visibility: local.activeKey === child._id ? 'visible' : 'hidden', zIndex: local.activeKey === child._id ? 2 : 1 }}>
                {child.attrs.template_id && local.mount_ids[child._id] ? <Template view={child.attrs.template_id} /> : <CenterXY><Loading /></CenterXY>}
              </div>
            </Fragment>
          ))}
        </div>
        <TabBar>
          {self.children.map(child => (
            <TabBar.Item
              key={child._id}
              title={child.title}
              icon={child.icon ? <Acon icon={child.icon} /> : null}
              onClick={e => {
                runInAction(() => {
                  local.activeKey = child._id;
                  local.setMounted(local.activeKey)
                })
              }}
            />
          ))}
        </TabBar>
      </div>
    </SafeArea>
  )}</Observer>
}