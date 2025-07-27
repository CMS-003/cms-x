import { Fragment, useCallback, useEffect } from "react";
import { runInAction } from "mobx";
import { Observer, useLocalObservable } from "mobx-react-lite";
import { apis, readableTime, useRouter, store } from '@/global.js';
import { Space, Tag } from "antd-mobile";
import { Acon, Nav, SafeArea, FullHeight, FullHeightAuto, FullHeightFix, FullWidth } from "@/components";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 1.4em;
  font-weight: 550;
  margin: 0;
  padding: 10px;
`

export default function PostPage(props) {
  const router = useRouter()
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
  const toggleStar = useCallback(async () => {
    const collected = local.resource.counter.collected
    try {
      runInAction(() => {
        local.resource.counter.collected = !collected
      })
      const resp = collected
        ? await apis.fetchAPI('post', '/gw/api/gatling/pJFc2GC9W', { resource_id: local.resource._id })
        : await apis.fetchAPI('post', '/gw/api/gatling/jw-KAgBzI', {
          resource_id: local.resource._id,
          resource_type: local.resource.type,
          title: local.resource.title,
          cover: local.resource.poster,
        });
      if (resp.code === 0) {

      } else {
        runInAction(() => {
          local.resource.counter.collected = collected
        })
      }
    } catch (e) {
      runInAction(() => {
        local.resource.counter.collected = collected
      })
    }
  }, [])
  useEffect(() => {
    getDetail();
  }, [getDetail])
  return <Observer>{() => (
    <SafeArea topBGC="lightblue" bot={0}>
      <FullHeight>
        <FullHeightFix>
          <Nav
            title={local.resource ? local.resource.title : ''}
            align="left"
            style={{ color: 'initial', backgroundColor: 'lightblue' }}
            right={local.resource
              ? <Acon icon={local.resource.counter.collected ? 'stared' : 'unstar'} color='#f66a83' size={24} onClick={toggleStar} onTouchEnd={toggleStar} />
              : null}
          />
        </FullHeightFix>
        <FullHeightAuto style={{ paddingBottom: 'var(--safe-padding-bottom)' }}>
          {local.resource ? <Fragment>
            <span style={{ padding: '8px 8px', display: 'inline-block' }}>
              <span onClick={() => {
                router.pushView('user', { id: local.resource.uid })
              }}>{local.resource.uname || '匿名'}</span>
              &nbsp;发布于&nbsp;{readableTime(new Date(local.resource.publishedAt))}
            </span>
            <p style={{ padding: '0 10px' }} dangerouslySetInnerHTML={{ __html: local.resource.content }}></p>
            {local.resource.images.map(image => (
              <img key={image._id} src={store.app.imageLine + image.path} style={{ width: '100%' }} alt="" />
            ))}
            {local.resource.videos.map(video => (
              <video key={video._id} src={store.app.videoLine + video.path} playsInline={true} controls style={{ width: '100%' }} />
            ))}
            {local.resource.tags.length ? <FullWidth style={{ alignItems: 'baseline', overflow: 'auto', margin: 10 }}>
              <Space>
                {(local?.resource?.tags || []).map(tag => (
                  <Tag key={tag} round color='#2db7f5' style={{ padding: '4px 6px' }}>
                    {tag}
                  </Tag>
                ))}
              </Space>
            </FullWidth> : null}
          </Fragment> : null}
        </FullHeightAuto>
      </FullHeight>
    </SafeArea>
  )}</Observer>
}