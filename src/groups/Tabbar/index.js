import React, { Fragment, useContext } from 'react';
import { TabBar } from "antd-mobile";
import { Observer, useLocalObservable } from "mobx-react-lite";
import RouterContext from '../../contexts/router.js';
import Auto from "../auto";

export default function ({ self }) {
  const router = useContext(RouterContext);
  const local = useLocalObservable(() => ({
    activeKey: self.children[0]._id,
    template_id: self.children[0].attrs.template_id,
  }));
  const View = router.getViewPage('Dynamic', local.template_id);
  return <Observer>{() => (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <View id={local.template_id} />
      </div>
      <TabBar>
        {self.children.map(child => (
          <TabBar.Item
            key={child._id}
            title={child.title}
            onClick={e => {
              console.log(e, child)
            }}
          />
        ))}
      </TabBar>
    </div>
  )}</Observer>
}