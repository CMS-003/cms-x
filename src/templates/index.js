import { Observer, useLocalObservable } from "mobx-react-lite";
import { Fragment, useCallback, useEffect } from "react";
import { useEffectOnce } from "react-use";
import apis from '@/apis'
import { CenterXY } from "@/components/style.js";
import { SpinLoading } from 'antd-mobile'
import { action } from "mobx";

import Dynamic from "./dynamic/index.js";
import Article from "./article/index.js";
import Video from "./video/index.js";
import Gallery from "./gallery/index.js";
import Channel from "./channel/index.js";
import Post from "./post/index.js";
import mine from "./mine/index.js";



const Templates = {
  Dynamic,
  Article,
  Video,
  Gallery,
  Channel,
  Post,
  mine,
}

export default function Template({ id }) {
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
    const resp = await apis.getTemplate(id)
    if (resp.code === 0) {
      local.setValue('template', resp.data);
    } else {
      local.isError = true;
    }
    local.isLoading = false;
  }, [id])
  useEffect(() => {
    if (!local.template && !local.isLoading) {
      getData(id);
    }
    return () => {

    }
  }, [id])

  return <Observer>{() => {
    const T = !local.template ? null : (Templates[local.template.name] || Templates[local.template.type] || Dynamic);
    if (local.isError) {
      return <div>error</div>
    }
    if (!local.template || local.isLoading) {
      return <CenterXY>
        <SpinLoading color='primary' />
      </CenterXY>
    } else {
      return T ? <T id={id} template={local.template} /> : null
    }
  }}</Observer>
}