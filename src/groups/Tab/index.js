import React, { Fragment, useContext } from 'react';
import { Observer } from "mobx-react-lite";
import { Tabs } from 'antd-mobile'
import RouterContext from '../../contexts/router.js';
import { Component } from '../auto'
import { toJS } from 'mobx';


export default function Tab({ self, children }) {
  const router = useContext(RouterContext);
  return <Observer>{() => (
    <div style={toJS(self.style)}>
      <Tabs>
        {self.children.map(child => {
          const template_id = child.attrs.template_id;
          const View = template_id ? router.getViewPage('Dynamic', template_id) : null;
          return (
            <Tabs.Tab key={child._id} title={child.title}>
              <div style={{ width: '100%', height: '100%' }}>
                {template_id ? <View id={template_id} /> : <Component self={child} />}
              </div>
            </Tabs.Tab>
          )
        })}
      </Tabs>
    </div>
  )}</Observer>
}