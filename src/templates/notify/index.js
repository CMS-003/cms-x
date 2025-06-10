import { Observer, useLocalObservable } from "mobx-react-lite";
import { useRouter } from "@/contexts/index.js";
import SafeArea from "@/components/SafeArea/index.js";
import Acon from "@/components/Acon";
import Nav from "@/components/Nav";
import { FullHeight, FullHeightAuto, FullWidth, FullWidthAuto, FullWidthFix } from "@/components/style";
import PageList from "@/components/List/index.js";
import { useCallback, useEffect } from "react";
import shttp from '../../utils/shttp.js'
import { Badge } from "antd-mobile";

export default function Notify({ template }) {
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
        url: `/gw/message/chats?page=${local.page}&size=${local.size}`,
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
  useEffect(() => {
    if (local.list.length === 0 && local.hasMore === true) {
      getList();
    }
  })
  return <Observer>{() => (
    <SafeArea topBGC="#58abdd">
      <FullHeight>
        <Nav title={template.title} style={{ backgroundColor: '#58abdd', color: '#fff' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', padding: '15px 0', borderBottom: '5px solid #e4e4e4' }}>
          <Acon icon="Comment" title='评论回复' style={{ gap: 5, flexDirection: 'column' }} />
          <Acon icon="At" title='@我' style={{ gap: 5, flexDirection: 'column' }} />
          <Acon icon="Thumb" title='收到的赞' style={{ gap: 5, flexDirection: 'column' }} />
          <Acon icon="System" title='系统消息' style={{ gap: 5, flexDirection: 'column' }} />
        </div>
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
                  router.pushView('chat', { id: item.chat_id })
                }}>
                  <FullWidthFix>
                    <Badge content={item.setting.mute ? (item.unread ? Badge.dot : null) : item.unread} wrapperStyle={{ marginRight: 5 }} style={{ marginRight: 5, marginTop: 10 }}>
                      <img src={item.friend.avatar} alt="" style={{ width: 40, height: 40, borderRadius: "50%", marginLeft: 5, marginTop: 5 }} />
                    </Badge>
                  </FullWidthFix>
                  <FullWidthAuto style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{item.friend.nickname}</div>
                    {item.latest && <div style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} >{item.latest.type === 1 ? item.latest.data.content : (item.latest.type === 2 ? '[图片消息]' : '[视频消息]')}</div>}
                  </FullWidthAuto>
                </FullWidth>
              ))
            }}
          />
        </FullHeightAuto>
      </FullHeight>
    </SafeArea>
  )}</Observer>
}