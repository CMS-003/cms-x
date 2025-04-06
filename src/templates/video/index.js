import { FullHeight, FullHeightAuto, FullHeightFix, FullWidth } from "@/components/style";
import { Observer, useLocalObservable } from "mobx-react-lite";
import Nav from "@/components/Nav";
import { useCallback, useEffect } from "react";
import apis from "@/apis";
import Player from "@/components/Player";
import { toJS } from "mobx";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 1.1em;
  font-weight: 500;
  margin: 0;
  padding: 10px;
`

export default function VideoPage(props) {
  const local = useLocalObservable(() => ({
    resource: null,
    loading: true,
    error: null,
  }));
  const getDetail = useCallback(async () => {
    local.loading = true;
    try {
      const resp = await apis.getResourceDetail(props.id);
      if (resp && resp.code === 0) {
        local.resource = resp.data;
      } else {
        local.error = { code: resp.code, message: resp.message }
      }
    } catch (e) {
      local.error = e
    } finally {
      local.loading = false;
    }

  })
  useEffect(() => {
    getDetail();
  }, [props.id])
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={{ flexDirection: 'column' }}>
        <Nav
          title={'视频详情'}
          align="left"
          style={{ position: 'absolute', zIndex: 10, background: 'linear-gradient(-180deg, #333, transparent)' }} />
        {local.resource && <Player
          resource={toJS(local.resource)}
          srcpath={'http://192.168.0.124' + '/upload/videos/animate/2021-02-13/1.mp4'}
        />}
      </FullHeightFix>
      <FullHeightAuto>
        <Title>{local.resource && local.resource.title}</Title>
      </FullHeightAuto>
    </FullHeight>
  )}</Observer>
}