import React, { Fragment, useContext } from 'react';
import { Observer } from "mobx-react-lite";
import { Tabs } from 'antd-mobile'
import RouterContext from '../../contexts/router.js';
import { Component } from '../auto'
import { toJS } from 'mobx';
import styled from 'styled-components';

const NotFound = styled.div`

`

export default function Tab({ self, children }) {
  const router = useContext(RouterContext);
  return <Observer>{() => (
    <div style={toJS(self.style)}>
      <Tabs style={{ '--content-padding': 0, '--title-font-size': '16px', height: '100%', display: 'flex', flexDirection: 'column' }} className='sticky-tabs-header'>
        {self.children.map(child => {
          const template_id = child.attrs.template_id;
          const View = template_id ? router.getViewPage(template_id) : NotFound;
          return (
            <Tabs.Tab key={child._id} title={child.title}>
              <div style={{ width: '100%', height: '100%', overscrollBehavior: 'auto', overflowY: 'auto', backgroundColor: '#eee' }}>
                {template_id ? <View id={template_id} /> : <Component self={child} />}
              </div>
            </Tabs.Tab>
          )
        })}
      </Tabs>
    </div>
  )}</Observer>
}