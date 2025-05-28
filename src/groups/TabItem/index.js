import React, { Fragment, useContext } from 'react';
import { Tabs } from 'antd-mobile'
import { Observer, useLocalObservable } from "mobx-react-lite";
import RouterContext from '../../contexts/router.js';

export default function TabItem({ self, children }) {
  const router = useContext(RouterContext);
  const local = useLocalObservable(() => ({
    template_id: self.attrs.template_id,
  }));
  const View = local.template_id ? router.getViewPage('dynamic', local.template_id) : null;
  return <Observer>{() => (
    View ? <View id={local.template_id} /> : children
  )}</Observer>
}