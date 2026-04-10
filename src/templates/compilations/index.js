import { useCallback, useContext, useEffect } from "react";
import dayjs from "dayjs";
import { chunk } from 'lodash'
import { runInAction } from "mobx";
import { Observer, useLocalObservable, } from "mobx-react-lite";
import { apis, store, shttp, useRouter } from '@/global.js';
import { Skeleton, Button } from 'antd-mobile'
import { Nav, SafeArea, AlignCenter, FullHeight, FullHeightAuto, FullWidth, FullWidthAuto, PageList } from "@/components";

export default function Compilations({ template, id }) {
  const router = useRouter()
  const local = useLocalObservable(() => ({
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
  const getData = useCallback(async () => {
    try {
      local.setValue('loading', true)
      const resp = await apis.getCompilationList({ page: local.page, size: 20 });
      if (resp.code === 0) {
        resp.data.items.forEach(v => v.type = 14);
        local.page === 1 ? local.setResources(resp.data.items) : local.setResources(local.resources.concat(resp.data.items))
        local.setValue('hasMore', resp.data.items.length > 0)
      } else {
        local.setValue('hasMore', false)
      }
    } catch (e) {
      local.setValue('hasMore', false)
    } finally {
      local.setValue('status', false)
      local.setValue('loading', false)
    }
  })
  const getMore = useCallback(async () => {
    if (local.loading) return;
    local.setValue('page', local.page + 1)
    await getData();
  }, [])
  useEffect(() => {
    if (local.resources.length === 0 && local.hasMore) {
      getData();
    }
  })
  return <Observer>{() => {
    if (local.status === 'loading') {
      return <FullHeight>
        <Skeleton.Title animated />
        <Skeleton.Paragraph animated lineCount={5} />
      </FullHeight>
    } else {
      return (
        <SafeArea>
          <Nav title="精选集合" />
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