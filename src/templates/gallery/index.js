import { Fragment, useCallback, useEffect } from "react";
import { Observer, useLocalObservable } from "mobx-react-lite";
import { default as dayjs } from "dayjs";
import styled from "styled-components";
import { Space, Tag } from "antd-mobile";
import { apis, store, } from '@/global.js';
import { Nav, SafeArea, FullHeight, FullHeightAuto, FullHeightFix, FullWidth } from "@/components";

const Title = styled.h1`
  font-size: 1.4em;
  font-weight: 550;
  margin: 0;
  padding: 10px;
`

export default function GalleryPage(props) {
  const local = useLocalObservable(() => ({
    resource: null,
    loading: true,
    error: null,
    recommends: [],
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
  const getRecommends = () => {

  }
  useEffect(() => {
    getDetail();
  }, [getDetail])
  return <Observer>{() => (
    <SafeArea>
      <FullHeight>
        <FullHeightFix>
          <Nav title={local.resource ? local.resource.title : ''} align="left" style={{ color: 'initial', backgroundColor: 'transparent' }} />
        </FullHeightFix>
        <FullHeightAuto>
          {local.resource ? <Fragment>
            <span style={{ padding: '0 8px 8px', display: 'inline-block' }}>{dayjs(local.resource.publishedAt).format('YYYY年MM月日DD HH:mm')}</span>
            {local.resource.images.map((image, i) => (
              <img key={i} src={store.app.imageLine + image.path} style={{ width: '100%' }} alt="" />
            ))}
          </Fragment> : null}
        </FullHeightAuto>
        <FullWidth style={{ alignItems: 'baseline', overflow: 'auto', margin: 10 }}>
          <Space>
            {(local?.resource?.tags || []).map(tag => (
              <Tag key={tag} round color='#2db7f5' style={{ padding: '4px 6px' }}>
                {tag}
              </Tag>
            ))}
          </Space>
        </FullWidth>
      </FullHeight>
    </SafeArea>
  )}</Observer>
}