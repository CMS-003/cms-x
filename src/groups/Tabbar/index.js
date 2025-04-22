import React, { Fragment, useContext, useMemo, memo } from 'react';
import { TabBar } from "antd-mobile";
import { Observer, useLocalObservable } from "mobx-react-lite";
import Acon from '@/components/Acon/index.js';
import Visible from '@/components/Visible/index.js';
import Template from '@/templates/index.js';
import { FullHeight } from '@/components/style.js';

export default function TabBarPage({ self }) {
  const local = useLocalObservable(() => ({
    activeKey: self.children[0]._id,
  }));
  return <Observer>{() => (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', overscrollBehavior: 'none' }}>
        {self.children.map(child => (
          <Visible key={child._id} visible={local.activeKey === child._id}>
            {child.attrs.template_id ? <Template id={child.attrs.template_id} /> : <FullHeight>{self.title}</FullHeight>}
          </Visible>
        ))}
      </div>
      <TabBar>
        {self.children.map(child => (
          <TabBar.Item
            key={child._id}
            title={child.title}
            icon={child.icon ? <Acon icon={child.icon} /> : null}
            onClick={e => {
              local.activeKey = child._id;
            }}
          />
        ))}
      </TabBar>
    </div>
  )}</Observer>
}