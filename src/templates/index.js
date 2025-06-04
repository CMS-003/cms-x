import { Observer, useLocalObservable } from "mobx-react-lite";
import { Fragment, useCallback, useEffect } from "react";
import { useEffectOnce } from "react-use";
import apis from '@/apis'
import { CenterXY } from "@/components/style.js";
import { SpinLoading } from 'antd-mobile'
import { action } from "mobx";

import dynamic from "./dynamic/index.js";
import article from "./article/index.js";
import video from "./video/index.js";
import gallery from "./gallery/index.js";
import channel from "./channel/index.js";
import post from "./post/index.js";
import mine from "./mine/index.js";
import notify from "./notify";
import search from "./search";
import chat from "./chat";

import SignIn from "@/pages/SignIn/index.js";

export const Templates = {
  dynamic,
  article,
  video,
  gallery,
  post,
  channel,
  mine,
  notify,
  search,
  chat,
  'sign-in': SignIn
}

export default function Template({ view, id }) {
  const local = useLocalObservable(() => ({
    isLoading: false,
    template: null,
    isError: false,
    setValue: action((key, value) => {
      if (key === 'template') {
        local.template = value;
      }
    }),
  }));
  const getData = useCallback(async () => {
    local.isLoading = true;
    try {
      const resp = await apis.getTemplate(view)

      if (resp.code === 0) {
        local.setValue('template', resp.data);
      } else {
        local.setValue('template', { attrs: {}, name: view, children: [] })
        // local.isError = true;
      }
    } catch (e) {

    } finally {
      local.isLoading = false;
    }
  }, [id])
  useEffect(() => {
    if (!local.template && !local.isLoading) {
      getData(id);
    }
    return () => {

    }
  }, [id])

  return <Observer>{() => {
    const T = !local.template ? null : (Templates[local.template.name] || Templates[local.template.type] || dynamic);
    if (local.isError) {
      return <div>error</div>
    }
    if (!local.template || local.isLoading) {
      return <CenterXY>
        <SpinLoading color='primary' />
      </CenterXY>
    } else {
      return T ? <T id={id} template={local.template} /> : <div>404</div>
    }
  }}</Observer>
}