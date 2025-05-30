import { Observer, useLocalObservable } from "mobx-react-lite";
import { useRouter } from "@/contexts/index.js";
import SafeArea from "@/components/SafeArea/index.js";
import Acon from "@/components/Acon";
import Nav from "@/components/Nav";
import { FullHeight, FullHeightAuto, FullWidth, FullWidthAuto, FullWidthFix } from "@/components/style";
import PageList from "@/components/List/index.js";
import { useCallback, useEffect } from "react";

export default function Notify({ template }) {
  const router = useRouter();
  const local = useLocalObservable(() => ({
    page: 1,
    list: [],
    loading: false,
    hasMore: true,
    setData(key, v) {
      local[key] = v;
    }
  }));
  const getList = useCallback(async () => {
    local.setData('hasMore', false)
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', padding: '20px 0', borderBottom: '10px solid #dadada' }}>
          <Acon icon="Comment" title='评论回复' style={{ flexDirection: 'column' }} />
          <Acon icon="At" title='@我' style={{ flexDirection: 'column' }} />
          <Acon icon="Thumb" title='收到的赞' style={{ flexDirection: 'column' }} />
          <Acon icon="System" title='系统消息' color='lightblue' style={{ flexDirection: 'column' }} />
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
              local.setData('page', local.page++)
              local.setData('loading', true)
              await getList();
              local.setData('loading', false)
            }}
            renderItems={(items) => {
              return items.map(item => (
                <FullWidth key={item._id} style={{ padding: '8px 0' }}>
                  <FullWidthFix>
                    <img src={item.friend.icon} alt="" style={{ width: 50, height: 50, borderRadius: 5, marginRight: 5 }} />
                  </FullWidthFix>
                  <FullWidthAuto style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>{item.friend.nickname}</div>
                    <div style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} >{item.lastMsg.type === 1 ? item.lastMsg.payload[0].content : (item.lastMsg.type === 2 ? '[图片消息]' : '[视频消息]')}</div>
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