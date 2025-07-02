import { Fragment, useCallback, useEffect } from "react";
import { Acon, Nav, SafeArea, FullHeight, FullHeightAuto, FullHeightFix, FullWidth } from '@/components';
import { Observer, useLocalObservable } from "mobx-react-lite";
import { runInAction } from "mobx";
import { apis, store, } from '@/global.js';
import { default as dayjs } from "dayjs";
import { Space, Tag } from "antd-mobile";

export default function ArticlePage(props) {
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
    <SafeArea>
      <FullHeight>
        <FullHeightFix>
          <Nav
            title={local.resource ? local.resource.title : ''}
            align="left"
            style={{ color: 'initial', backgroundColor: 'transparent' }}
            right={local.resource
              ? <Acon icon={local.resource.counter.collected ? 'stared' : 'unstar'} color='#f66a83' size={24} onClick={toggleStar} onTouchEnd={toggleStar} />
              : null}
          />
        </FullHeightFix>
        <FullHeightAuto>
          {local.resource ? <Fragment>
            <span style={{ padding: '0 8px 8px', display: 'inline-block' }}>{dayjs(local.resource.publishedAt).format('YYYY年MM月日DD HH:mm')}</span>
            <div style={{ overflow: 'hidden', padding: '0 5px' }} dangerouslySetInnerHTML={{ __html: local.resource.content }}></div>
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