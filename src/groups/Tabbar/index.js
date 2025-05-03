import React, { Fragment, useContext, useMemo, memo } from 'react';
import { TabBar } from "antd-mobile";
import { Observer, useLocalObservable } from "mobx-react-lite";
import Acon from '@/components/Acon/index.js';
import Template from '@/templates/index.js';
import { FullHeight } from '@/components/style.js';
import { runInAction } from 'mobx';

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
  }));
  return <Observer>{() => (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', overscrollBehavior: 'none' }}>
        {self.children.map(child => (
          <Hidden key={child._id} visible={local.activeKey === child._id}>
            {child.attrs.template_id ? <Template id={child.attrs.template_id} /> : <FullHeight>{self.title}</FullHeight>}
          </Hidden>
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
              })
            }}
          />
        ))}
      </TabBar>
    </div>
  )}</Observer>
}