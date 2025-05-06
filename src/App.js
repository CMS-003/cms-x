import { Observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback } from 'react';
import store from './store';
import apis from './apis'
import { useEffectOnce } from 'react-use';
import { CenterXY } from './components/style.js'
import { Button } from 'antd-mobile';
import Router from './router.js'

function App() {
  const local = useLocalObservable(() => ({
    isError: false,
  }));
  const biu = useCallback((async () => {
    store.app.setBoot(true)
    try {
      const resp = await apis.boot();
      if (resp.code !== 0) {
        local.isError = true
        console.log(resp, '启动失败')
      } else {
        if (store.user.access_token) {
          const resp_profile = await apis.getProfile()
          if (resp_profile) {
            store.user.setInfo(resp_profile.data.item)
          }
        }
      }
    } catch (e) {
      local.isError = true
    }
    store.app.setBoot(false)
  }), [local])
  useEffectOnce(() => {
    biu();
    window.addEventListener('online', () => {
      if (local.isError) {
        local.isError = false
        biu()
      }
    })
    window.addEventListener('orientationchange', () => {
      store.app.setOrientation(window.screen.orientation.angle)
    })
  })
  return (
    <Observer>{() => {
      if (store.app.isBooting) {
        return <CenterXY style={{
          backgroundImage: `url(/demo/logo.png)`
        }}>

        </CenterXY>
      } else if (local.isError) {
        return <Button
          style={{ width: 150 }}
          type="primary"
          onClick={() => {
            biu();
            local.isError = false;
          }}
        >
          {navigator.onLine ? '点击重试' : '您处于离线状态'}
        </Button>
      } else {
        return <Router />
      }
    }}</Observer>
  );
}

export default App;
