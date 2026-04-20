import React, { useEffect } from 'react';
import { Observer, useLocalObservable } from "mobx-react-lite";
import { Tabs } from 'antd-mobile'
import { Component } from '../auto'
import { toJS } from 'mobx';
import { useRouter } from '@/global.js';
import styled from 'styled-components';
import events from '@/utils/event';
import { omit } from 'lodash';

const NotFound = styled.div`

`

export default function Tab({ self }) {
  const router = useRouter()
  const local = useLocalObservable(() => ({
    inited: false,
    selectedId: self.children[0]._id,
    setInited() {
      local.inited = true
    },
    setSelectedId(id) {
      local.selectedId = id
    }
  }))
  const onReset = function (e) {
    if (e.template._id === self.template_id) {
      const _id = self.children[0]._id
      local.setSelectedId(_id)
      events.emit('refresh', { template: e.template, component: self.children[0] })
    }
  }
  useEffect(() => {
    if (!local.inited) {
      local.setInited()
      events.on('reset', onReset)
    }
    return () => {
      events.off('reset', onReset)
    }
  }, [self])
  return <Observer>{() => (
    <div style={toJS(self.style)}>
      <Tabs
        style={{ '--content-padding': 0, '--title-font-size': '16px', height: '100%', display: 'flex', flexDirection: 'column' }}
        className='sticky-tabs-header'
        activeKey={local.selectedId}
        onChange={(id) => {
          local.setSelectedId(id);
        }}
      >
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