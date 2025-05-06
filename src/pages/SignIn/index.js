import { AlignCenter, FullHeight, FullHeightAuto, FullHeightFix } from "@/components/style.js";
import { Button, Input, List, } from "antd-mobile";
import { Observer, useLocalObservable } from "mobx-react-lite";
import Acon from "@/components/Acon/index.js";
import apis from "@/apis/index.js";
import store from "@/store/index.js";
import { useNavigate } from "react-router";

export default function SignIn() {
  const navigate = useNavigate()
  const local = useLocalObservable(() => ({
    loading: false,
    type: 'account',
    account: '',
    value: '',
  }))
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={{ padding: 10, alignItems: 'center' }}>
        <Acon icon="LeftOutlined"
          onClick={() => {
            // router.backView();
            window.history.back();
          }}
          onTouchEnd={() => {
            // router.backView();
            window.history.back();
          }}
        />
        登录
      </FullHeightFix>
      <FullHeightAuto style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%,-50%)' }}>
          <List>
            <List.Item title="账号">
              <Input name="account" autoFocus onChange={v => {
                local.account = v;
              }} />
            </List.Item>
            <List.Item title="密码">
              <Input name="password" onChange={v => {
                local.value = v;
              }} />
            </List.Item>
          </List>
          <AlignCenter>
            <Button type='button' block size='small' color="primary" onClick={async () => {
              local.loading = true
              try {
                const resp = await apis.signIn({
                  type: local.type,
                  account: local.account,
                  value: local.value,
                });
                console.log(resp.data)
                if (resp.code === 0) {
                  store.user.setAccessToken(resp.data.access_token)
                  store.user.setRefreshToken(resp.data.refresh_token)
                  const resp_profile = await apis.getProfile();
                  if (resp_profile.code === 0) {
                    store.user.setInfo(resp_profile.data.item)
                    navigate('/demo/')
                  }
                }
              } catch (e) {

              } finally {
                local.loading = false
              }
            }}>登录</Button>
          </AlignCenter>
        </div>
      </FullHeightAuto>
    </FullHeight>
  )}</Observer>
}