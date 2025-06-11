import { AlignCenter, Center, FullHeight, FullHeightAuto, FullHeightFix, FullWidth, FullWidthAuto } from "@/components/style.js";
import { Observer } from "mobx-react-lite";
import store from "@/store/index.js";
import { Button, List } from "antd-mobile";
import RouterContext from "@/contexts/router.js";
import { useContext } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import Auto from "@/groups/auto.js";
import apis from "@/apis/index.js";
import Acon from "@/components/Acon";
import { CenterXY } from "@/components/style.js";

const Btn = styled.div`
  background-color: #03c1ff;
  padding: 4px 10px;
  color: white;
  display: inline;
  border-radius: 5px;
  font-size: 14px;
`

export default function Mine({ template }) {
  const router = useContext(RouterContext)
  const navigate = useNavigate()
  return <Observer>{() => (
    <FullHeight>
      <FullWidth>
        <AlignCenter style={{ width: 50, height: 50, padding: 20 }}>
          <img
            src={store.user.isLogin ? store.user.info.avatar || "/demo/logo.png" : "/demo/logo.png"}
            style={{
              borderRadius: '50%',
              width: '100%',
              height: '100%',
            }}
            alt=""
          />
        </AlignCenter>
        <FullWidthAuto>
          {store.user.isLogin ? store.user.info.nickname : <Btn type='button' onClick={() => { router.pushView('sign-in') }}>登陆</Btn>}
        </FullWidthAuto>
        {store.user.isLogin && <CenterXY style={{ color: 'goldenrod', marginRight: 20 }} onClick={() => { router.pushView('user', { id: store.user.info.name }) }}><span >个人主页</span> <Acon icon='right' style={{ fontSize: 16 }} /></CenterXY>}
      </FullWidth>
      <FullWidthAuto style={{ flex: 0 }}>
        <Auto template={template} />
      </FullWidthAuto>
      <FullHeightFix style={{ flexDirection: 'column', }}>
        <List style={{ '--border-inner': 'none', '--border-bottom': 'none', '--font-size': 16, width: '100%', paddingLeft: 15, boxSizing: 'border-box' }}>
          <List.Item onClick={() => { }}><div style={{ padding: '10px 0' }}>设置</div></List.Item>
          <List.Item onClick={() => { }}><div style={{ padding: '10px 0' }}>免打扰</div></List.Item>
          <List.Item onClick={() => { }}><div style={{ padding: '10px 0' }}>推送</div></List.Item>
        </List>
      </FullHeightFix>
      {store.user.isLogin && <div style={{ padding: 10 }}><Button color='default' block onClick={async () => {
        try {
          await apis.signOut()
        } catch (e) {

        } finally {
          store.user.logout()
        }

      }}>退出</Button></div>}
    </FullHeight>
  )}</Observer>
}