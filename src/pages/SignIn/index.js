import { AlignCenter, FullHeight, FullHeightAuto, FullHeightFix } from "@/components/style.js";
import { Button, Input, List, } from "antd-mobile";
import { Observer, useLocalObservable } from "mobx-react-lite";
import Acon from "@/components/Acon/index.js";
import apis from "@/apis/index.js";
import store from "@/store/index.js";
import { useNavigate } from "react-router";
import { useRouter } from "@/contexts/index.js";
import styled from "styled-components";
import SafeArea from "@/components/SafeArea/index.js";

const Btn = styled.div`
  background-color: #62cff3;
  padding: 8px 10px;
  color: white;
  border-radius: 5px;
  font-size: 14px;
  flex: 1;
  text-align: center;
  margin-top: 15px;
`

export default function SignIn() {
  const router = useRouter();
  const navigate = useNavigate()
  const local = useLocalObservable(() => ({
    loading: false,
    type: 'account',
    account: '',
    value: '',
  }))
  return <Observer>{() => (
    <SafeArea>
      <FullHeight>
        <FullHeightFix style={{ padding: 10, alignItems: 'center' }}>
          <Acon icon="LeftOutlined"
            onClick={() => {
              router.backView();
            }}
            onTouchEnd={() => {
              router.backView();
            }}
          />
          登录
        </FullHeightFix>
        <FullHeightAuto style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%,-50%)', }}>
            <List style={{ borderRadius: 10, overflow: 'hidden', '--border-inner': 'none', }}>
              <List.Item title="账号" style={{ marginTop: 10 }}>
                <Input name="account" autoComplete='off' autoFocus onChange={v => {
                  local.account = v;
                }} />
              </List.Item>
              <List.Item title="密码" style={{ marginBottom: 10 }}>
                <Input name="password" autoComplete='off' type='password' onChange={v => {
                  local.value = v;
                }} />
              </List.Item>
            </List>
            <AlignCenter>
              <Btn onClick={async () => {
                local.loading = true
                try {
                  const resp = await apis.signIn({
                    type: local.type,
                    account: local.account,
                    value: local.value,
                  });
                  if (resp.code === 0) {
                    store.user.setAccessToken(resp.data.access_token)
                    store.user.setRefreshToken(resp.data.refresh_token)
                    const resp_profile = await apis.getProfile();
                    if (resp_profile.code === 0) {
                      store.user.setInfo(resp_profile.data.item)
                      router.backView()
                    }
                  }
                } catch (e) {

                } finally {
                  local.loading = false
                }
              }}>登录</Btn>
            </AlignCenter>
          </div>
        </FullHeightAuto>
      </FullHeight>
    </SafeArea>
  )}</Observer>
}