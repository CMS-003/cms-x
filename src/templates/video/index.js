import { FullHeight, FullHeightAuto, FullHeightFix, FullWidth } from "@/components/style";
import { Observer, useLocalObservable } from "mobx-react-lite";
import Nav from "@/components/Nav";
import { useCallback, useEffect } from "react";
import apis from "@/apis";
import Player from "@/components/Player";
import { toJS } from "mobx";
import styled from "styled-components";
import { useStore } from "@/contexts/index.js";

const Title = styled.h1`
  font-size: 1.1em;
  font-weight: 500;
  margin: 0;
  padding: 10px;
`

export default function VideoPage(props) {
  const store = useStore();
  const local = useLocalObservable(() => ({
    resource: null,
    loading: true,
    error: null,
    setValue: function (key, value) {
      local[key] = value;
    }
  }));
  const getDetail = useCallback(async () => {
    local.setValue('loading', true);
    try {
      const resp = await apis.getResourceDetail(props.id);
      if (resp && resp.code === 0) {
        local.setValue('resource', resp.data)
      } else {
        local.setValue('error', { code: resp.code, message: resp.message })
      }
    } catch (e) {
      local.setValue('error', e)
    } finally {
      local.setValue('loading', false);
    }

  }, [local, props.id])
  useEffect(() => {
    getDetail();
  }, [getDetail])
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={{ flexDirection: 'column' }}>
        {local.resource && <Player
          resource={toJS(local.resource)}
          srcpath={store.app.videoLine + '/upload/big_buck_bunny.mp4'}
        />}
      </FullHeightFix>
      <FullHeightAuto>
        <Title>{local.resource && local.resource.title}</Title>
      </FullHeightAuto>
    </FullHeight>
  )}</Observer>
}