import { useCallback, useContext, useEffect } from "react";
import dayjs from "dayjs";
import { runInAction } from "mobx";
import { Observer, useLocalObservable, } from "mobx-react-lite";
import { apis, store, shttp, useRouter } from '@/global.js';
import { Skeleton, Button } from 'antd-mobile'
import { Nav, SafeArea, AlignCenter, FullHeight, FullHeightAuto, FullWidth, FullWidthAuto } from "@/components";

export default function User({ template, id }) {
  const router = useRouter()
  const local = useLocalObservable(() => ({
    user: null,
    status: 'loading', // success/failure
    setValue(k, v) {
      switch (k) {
        case 'status': local.status = v; break;
        case 'user': local.user = v; break;
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
  useEffect(() => {
    if (local.status === 'loading') {
      getUserInfo();
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

          </FullHeightAuto>
        </SafeArea>
      )
    }
  }}</Observer >
}