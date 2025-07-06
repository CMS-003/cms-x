import { useCallback, useContext, useEffect } from "react";
import dayjs from "dayjs";
import { chunk } from 'lodash'
import { runInAction } from "mobx";
import { Observer, useLocalObservable, } from "mobx-react-lite";
import { apis, store, shttp, useRouter } from '@/global.js';
import { Skeleton, Button } from 'antd-mobile'
import { Nav, SafeArea, AlignCenter, FullHeight, FullHeightAuto, FullWidth, FullWidthAuto, PageList } from "@/components";

export default function User({ template, id }) {
  const router = useRouter()
  const local = useLocalObservable(() => ({
    user: null,
    status: 'loading', // success/failure
    loading: true,
    resources: [],
    page: 1,
    hasMore: true,
    setResources(resources) {
      local.resources = resources;
    },
    setValue(k, v) {
      switch (k) {
        case 'status': local.status = v; break;
        case 'user': local.user = v; break;
        case 'page': local.page = v; break;
        case 'loading': local.loading = v; break;
        case 'hasMore': local.hasMore = v; break;
        default: break;
      }
    }
  }))
  const getUserInfo = useCallback(async () => {
    try {
      const result = await shttp({
        url: `/gw/user/info?id=${id}`
      })
      if (result && result.code === 0) {
        local.setValue('user', result.data);
        local.setValue('status', 'success')
      } else {
        local.setValue('status', 'failure')
      }
    } catch (e) {
      local.setValue('status', 'failure')
    }
  })
  const getData = useCallback(async () => {
    try {
      local.setValue('loading', true)
      const resp = await apis.getResourceList({ page: local.page, size: 20, uid: id });
      if (resp.code === 0) {
        local.page === 1 ? local.setResources(resp.data.items) : local.setResources(local.resources.concat(resp.data.items))
        local.setValue('hasMore', resp.data.items.length > 0)
      }
    } catch (e) {
      local.setValue('hasMore', false)
    } finally {
      local.setValue('loading', false)
    }
  })
  const getMore = useCallback(async () => {
    if (local.loading) return;
    local.setValue('page', local.page + 1)
    await getData();
  }, [])
  useEffect(() => {
    if (local.status === 'loading') {
      getUserInfo();
    }
    if (local.resources.length === 0 && local.hasMore) {
      getData();
    }
  })
  return <Observer>{() => {
    if (local.status === 'failure') {
      return <div>fail</div>
    }
    else if (local.status === 'loading') {
      return <FullHeight>
        <Skeleton.Title animated />
        <Skeleton.Paragraph animated lineCount={5} />
      </FullHeight>
    } else {
      return (
        <SafeArea>
          <Nav />
          <FullWidth>
            <AlignCenter style={{ width: 50, height: 50, padding: 20 }}>
              <img
                src={local.user.avatar}
                style={{
                  borderRadius: '50%',
                  width: '100%',
                  height: '100%',
                }}
                alt=""
              />
            </AlignCenter>
            <FullWidthAuto>
              <div style={{ fontSize: 18 }}>{local.user.nickname}</div>
              <div style={{ fontSize: 12, color: 'grey', marginTop: 5 }}>注册于{dayjs(local.user.createdAt).format('YYYY-MM-DD')}</div>
            </FullWidthAuto>
            {store.user.isLogin && store.user.info.id !== local.user._id && local.user.counted &&
              <Button
                size='mini'
                color={local.user.counted.followed ? 'warning' : 'primary'}
                style={{ marginRight: 10 }}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  await apis.toggleFollow(local.user.counted.followed, local.user._id)
                  runInAction(() => {
                    local.user.counted.followed = local.user.counted.followed ? 0 : 1;
                  })
                }}
              >{local.user.counted.followed ? '取消关注' : '关注'}</Button>}
          </FullWidth>
          <FullHeightAuto style={{ overflow: 'hidden auto' }}>
            <PageList
              display={'lprt'}
              multi={false}
              items={chunk(local.resources, 1)}
              onRefresh={async () => {
                local.setValue('page', 1)
                await getData();
              }}
              loadMore={getMore}
              hasMore={local.hasMore}
            />
          </FullHeightAuto>
        </SafeArea>
      )
    }
  }}</Observer >
}