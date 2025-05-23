import { AlignCenter, FullHeight, FullWidth, FullWidthAuto } from "@/components/style.js";
import { Observer } from "mobx-react-lite";
import store from "@/store/index.js";
import { Button } from "antd-mobile";
import RouterContext from "@/contexts/router.js";
import { useContext } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

const Btn = styled.div`
  background-color: lightblue;
  padding: 4px 10px;
  color: white;
  display: inline;
  border-radius: 5px;
  font-size: 14px;
`

export default function Mine() {
  const router = useContext(RouterContext)
  const navigate = useNavigate()
  return <Observer>{() => (
    <FullHeight>
      <FullWidth>
        <AlignCenter style={{ width: 50, height: 50, padding: 20 }}>
          <img
            src={store.user.isLogin ? store.user.info.avatar || "/logo.jpg" : "/logo.jpg"}
            style={{
              borderRadius: '50%',
              width: '100%',
              height: '100%',
            }}
            alt=""
          />
        </AlignCenter>
        <FullWidthAuto>
          {store.user.isLogin ? store.user.info.name : <Btn type='button' onClick={() => { router.pushView('sign-in') }}>登陆</Btn>}
        </FullWidthAuto>
        <Btn style={{ marginRight: 20 }} onClick={() => window.location.reload()}>刷新</Btn>
      </FullWidth>
    </FullHeight>
  )}</Observer>
}