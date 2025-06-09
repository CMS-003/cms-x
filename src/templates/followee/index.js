import { Observer, useLocalObservable } from "mobx-react-lite";
import { useRouter } from "@/contexts/index.js";
import SafeArea from "@/components/SafeArea/index.js";
import Acon from "@/components/Acon";
import Nav from "@/components/Nav";
import { FullHeight, FullHeightAuto, FullWidth, FullWidthAuto, FullWidthFix } from "@/components/style";
import PageList from "@/components/List/index.js";
import { useCallback, useEffect } from "react";
import shttp from '../../utils/shttp.js'
import { Button } from "antd-mobile";
import apis from "@/apis/index.js";
import { runInAction } from "mobx";

// 我的关注
export default function Followee({ template }) {
  const router = useRouter();
  const local = useLocalObservable(() => ({
    page: 1,
    size: 20,
    list: [],
    loading: true,
    hasMore: true,
    setData(key, v) {
      local[key] = v;
    }
  }));
  const getList = useCallback(async () => {
    try {
      local.setData('loading', true)
      const resp = await shttp({
        url: `/gw/user/interaction/followees?page=${local.page}&size=${local.size}`,
      });
      if (resp.code === 0) {
        local.setData('hasMore', resp.data.list.length === local.size)
        local.setData('list', resp.data.list);
      } else {
        local.setData('hasMore', false)
      }
    } catch (e) {
      local.setData('hasMore', false)
    } finally {
      local.setData('loading', false)
    }
  });
  const toggleFollow = useCallback(async (follow, user_id) => {
    try {
      follow ? await shttp.delete(`/gw/user/interaction/follow/${user_id}`) : await shttp.post(`/gw/user/interaction/follow/${user_id}`)
    } catch (e) {

    }
  })
  useEffect(() => {
    if (local.list.length === 0 && local.hasMore === true) {
      getList();
    }
  })
  return <Observer>{() => (
    <SafeArea topBGC="#58abdd">
      <FullHeight>
        <Nav title={template.title || '我的关注'} style={{ backgroundColor: '#58abdd', color: '#fff' }} />
        <FullHeightAuto>
          <PageList
            items={local.list}
            multi={false}
            infinite={true}
            hasMore={local.hasMore}
            onRefresh={async () => {
              local.setData('page', 1)
              local.setData('loading', true)
              await getList();
              local.setData('loading', false)
            }}
            loadMore={async () => {
              if (local.loading || !local.hasMore) {
                return;
              }
              local.setData('page', local.page + 1)
              local.setData('loading', true)
              await getList();
              local.setData('loading', false)
            }}
            renderItems={(items) => {
              return items.map(item => (
                <FullWidth key={item._id} style={{ padding: '8px 0' }} onClick={() => {
                  router.pushView('user', { id: item._id })
                }}>
                  <FullWidthFix>
                    <img src={item.avatar} alt="" style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10, marginLeft: 5 }} />
                  </FullWidthFix>
                  <FullWidthAuto style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{item.nickname}</div>
                  </FullWidthAuto>
                  <div>
                    <Button
                      size='mini'
                      color={item.counted.followed ? 'warning' : 'primary'}
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        await toggleFollow(item.counted.followed, item._id)
                        runInAction(() => {
                          item.counted.followed = item.counted.followed ? 0 : 1;
                        })
                      }}
                    >{item.counted.followed ? '取消关注' : '关注'}</Button>
                  </div>
                </FullWidth>
              ))
            }}
          />
        </FullHeightAuto>
      </FullHeight>
    </SafeArea>
  )}</Observer>
}