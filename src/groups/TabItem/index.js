import React from 'react';
import { Observer, useLocalObservable } from "mobx-react-lite";
import { useRouter } from '@/global.js';

export default function TabItem({ self, children }) {
  const router = useRouter()
  const local = useLocalObservable(() => ({
    template_id: self.attrs.template_id,
  }));
  const View = local.template_id ? router.getViewPage('dynamic', local.template_id) : null;
  return <Observer>{() => (
    View ? <View id={local.template_id} /> : children
  )}</Observer>
}