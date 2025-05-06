import { AlignCenter, FullHeight, FullWidth, FullWidthAuto } from "@/components/style.js";
import { Observer } from "mobx-react-lite";
import store from "@/store/index.js";
import { Button } from "antd-mobile";
import RouterContext from "@/contexts/router.js";
import { useContext } from "react";
import { useNavigate } from "react-router";

export default function Mine() {
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
          {store.user.isLogin ? store.user.info.name : <Button type='button' onClick={() => {
            navigate('/demo/sign-in');
          }}>登陆</Button>}
        </FullWidthAuto>
      </FullWidth>
    </FullHeight>
  )}</Observer>
}