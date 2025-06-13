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
import styled from 'styled-components'

const Header = styled.div`
 font-weight: 600;
 font-size: 14px;
 padding: 10px;
 color: #555;
`
const Content = styled.div`
  border-radius: 4px;
  padding: 0 10px 10px;
`
const ScrollWrap = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: auto;
  box-sizing: border-box;
  height: 100%;
  gap: 10px;
  &::-webkit-scrollbar {
    display: none;
  }
  &>div:first-child {
    margin-left: 0;
  }
`;
const ItemWrap = styled.div`
  width: 50px;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 12px;
`
const Avatar = styled.div`
  padding-top: 100%;
  box-sizing: border-box;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`
const Dot = styled.span`
  position: absolute;
  bottom: 5px;
  right: 5px;
  border: 2px solid #fff;
  background-color: pink;
  border-radius: 50%;
  padding: 4px;
`

// 我的关注
export default function Followee({ template }) {
  const router = useRouter();
  const local = useLocalObservable(() => ({
    page: 1,
    size: 20,
    followees: [],
    loading: true,
    hasMore: true,
    setData(key, v) {
      local[key] = v;
    }
  }));
  const getFollowees = useCallback(async () => {
    try {
      local.setData('loading', true)
      const resp = await shttp({
        url: `/gw/user/interaction/followees?latest=1&page=${local.page}&size=${local.size}`,
      });
      if (resp.code === 0) {
        local.setData('hasMore', resp.data.list.length === local.size)
        local.setData('followees', resp.data.list);
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
    if (local.followees.length === 0 && local.hasMore === true) {
      getFollowees();
    }
  })
  return <Observer>{() => (
    <SafeArea topBGC="#58abdd">
      <FullHeight>
        <Header>最常访问</Header>
        <Content>
          <ScrollWrap>
            {local.followees.map(v => (
              <ItemWrap key={v._id}>
                <div style={{ position: 'relative', padding: 5 }}>
                  <Avatar style={{ backgroundImage: `url('${v.avatar}')` }} />
                  {v.counted.unread ? <Dot /> : null}
                </div>
                <div>{v.nickname}</div>
              </ItemWrap>
            ))}
          </ScrollWrap>
        </Content>
        <FullHeightAuto>
          <PageList
            items={[]}
            multi={false}
            infinite={true}
            hasMore={local.hasMore}
            onRefresh={async () => {
              local.setData('page', 1)
              local.setData('loading', true)
              await getFollowees();
              local.setData('loading', false)
            }}
            loadMore={async () => {
              if (local.loading || !local.hasMore) {
                return;
              }
              local.setData('page', local.page + 1)
              local.setData('loading', true)
              await getFollowees();
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
                        await apis.toggleFollow(item.counted.followed, item._id)
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