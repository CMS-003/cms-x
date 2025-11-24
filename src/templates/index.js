import { useCallback, useEffect } from "react";
import apis from '@/apis'
import { CenterXY } from "@/components";
import { SpinLoading } from 'antd-mobile'
import { action } from "mobx";
import { Observer, useLocalObservable } from "mobx-react-lite";

import dynamic from "./dynamic";
import channel from "./channel";
import mine from "./mine";
import timeline from "./timeline";
import notify from "./notify";
import followee from "./followee";
import searchEntry from "./search-entry";
import searchResult from "./search-result";
import chat from "./chat";
import user from "./user";

import article from "./article";
import video from "./video";
import post from "./post";
import gallery from "./gallery";

import SignIn from "@/pages/SignIn";
import QueryContext from "@/contexts/query";

export const Templates = {
  dynamic,
  article,
  video,
  gallery,
  post,
  channel,
  mine,
  notify,
  followee,
  'search-entry': searchEntry,
  'search-result': searchResult,
  chat,
  user,
  timeline,
  'sign-in': SignIn
}

export default function Template({ view, id, active, query }) {
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

  return <QueryContext.Provider value={query}>
    <Observer>{() => {
      const T = !local.template ? null : (Templates[local.template.name] || Templates[local.template.type] || dynamic);
      if (local.isError) {
        return <div>error</div>
      }
      if (!local.template || local.isLoading) {
        return <CenterXY>
          <SpinLoading color='primary' />
        </CenterXY>
      } else {
        return T ? <T id={id} template={local.template} active={active} query={query} /> : <div>404</div>
      }
    }}</Observer>
  </QueryContext.Provider>
}