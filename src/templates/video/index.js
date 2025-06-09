import { FullHeight, FullHeightAuto, FullHeightFix, FullWidth } from "@/components/style";
import { Observer, useLocalObservable } from "mobx-react-lite";
import { Fragment, useCallback, useEffect } from "react";
import apis from "@/apis";
import Player from "@/components/Player";
import { runInAction } from "mobx";
import styled from "styled-components";
import { useStore } from "@/contexts/index.js";
import Visible from "@/components/Visible";
import { Ellipsis, Space, Tag } from "antd-mobile";
import ResourceItem from "@/adaptor/index.js";
import { default as dayjs } from "dayjs";
import Acon from "@/components/Acon";
import { browser } from "@/utils";
import SafeArea from "@/components/SafeArea";
import PageList from "@/components/List/index.js";

const Title = styled.h1`
  font-size: 1.4em;
  font-weight: 550;
  margin: 0;
  padding: 10px;
`
export const Epsode = styled.span`
  color: ${({ selected }) => (selected ? 'rgb(0 165 253)' : '#888')};
  margin: 2px 3px;
  padding: 3px 4px;
  position: relative;
  font-size: 11px;
  white-space: nowrap;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 200%;
    height: 200%;
    border: 1px solid
      ${({ selected }) => (selected ? 'rgb(0 165 253)' : '#888')};
    border-radius: 6px;
    transform-origin: 0 0;
    transform: scale(0.5);
    box-sizing: border-box;
    pointer-events: none;
  }
`;

export default function VideoPage(props) {
  const store = useStore();
  const local = useLocalObservable(() => ({
    resource: null,
    loading: true,
    error: null,
    video: null,
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
        local.setValue('video', resp.data.videos[0] || null)
        getRecommends();
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
        ? await apis.fetchAPI('post', '/gw/manager/api/gatling/pJFc2GC9W', { resource_id: local.resource._id })
        : await apis.fetchAPI('post', '/gw/manager/api/gatling/jw-KAgBzI', {
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
  const getRecommends = useCallback(async () => {
    try {
      const resp = await apis.fetchAPI('get', '/gw/manager/api/gatling/XKjvJJ6rV')
      if (resp.code === 0) {
        local.setValue('recommends', resp.data.items);
      }
    } catch (e) {

    }
  });
  useEffect(() => {
    getDetail();
  }, [getDetail])
  return <Observer>{() => (
    <SafeArea topBGC="black">
      <FullHeight style={{ position: 'relative' }}>
        <FullHeightFix style={{ flexDirection: 'column', }}>
          <Player
            resource={local.resource}
            video={local.video}
            looktime={0}
            type="mp4"
          />
        </FullHeightFix>
        <FullHeightAuto>
          {
            local.resource ? (<Fragment>
              <Title>{local.resource.title}</Title>
              <FullWidth style={{ padding: '0 10px 10px', gap: 8, justifyContent: 'flex-start' }}>
                <span>{dayjs(local.resource.publishedAt).format('YYYY年MM月日DD HH:mm')}</span>
                <Acon icon={local.resource.counter.collected ? 'stared' : 'unstar'} color='pink' size={24} onTouchEnd={toggleStar} />
              </FullWidth>
              <Ellipsis content={local.resource.content} rows={2}
                expandText='展开'
                collapseText='收起' />
              <FullWidth style={{ alignItems: 'baseline', overflow: 'auto' }}>
                <Space style={{ padding: '0 10px' }}>
                  {local.resource.tags.map(tag => (
                    <Tag key={tag} round color='#2db7f5' style={{ padding: '4px 6px' }}>
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </FullWidth>
              <Visible visible={local.resource.videos.length > 1}>
                <p
                  style={{
                    fontWeight: 'bolder',
                    margin: 0,
                    padding: '10px 10px 5px',
                  }}
                >
                  播放列表
                </p>
                <FullWidth style={{ alignItems: 'baseline', overflow: 'auto', padding: '0 8px' }}>
                  {local.resource.videos.map((child) => (
                    <Epsode
                      key={child.path}
                      onClick={() => {
                        if (local.vid !== child._id) {
                          local.video = child;
                          local.looktime = 0;
                        }
                      }}
                      selected={local.video && local.video._id === child._id}
                    >
                      {child.title || `第${child.nth}集`}
                    </Epsode>
                  ))}
                </FullWidth>
              </Visible>
            </Fragment>) : null
          }
          <div style={{ fontSize: 16, fontWeight: 600, margin: '10px 10px 0' }}>推荐</div>
          <PageList
            disabled={true}
            display="lprt"
            items={local.recommends}
            infinite={false}
            renderItems={(items) => items.map(v => (
              <div key={v._id} style={{ margin: '10px 5px' }}>
                <ResourceItem item={v} type="lprt" />
              </div>
            ))}
          />
        </FullHeightAuto>
      </FullHeight>
    </SafeArea>
  )}</Observer>
}