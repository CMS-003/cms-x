import { Observer } from "mobx-react-lite";
import { Dialog } from "antd-mobile";
import { store, useRouter } from '@/global.js';
import Acon from '../../components/Acon'
import { toJS } from "mobx";

export default function Icon({ self }) {
  const router = useRouter();
  return <Observer>{() => (
    <Acon icon={self.icon} title={self.title} color={'black'} style={toJS(self.style)} onClick={() => {
      if (self.widget.action === 'GOTO_PAGE') {
        if (self.attrs.auth && !store.user.isLogin) {
          const handler = Dialog.show({
            content: '需要登录',
            actions: [[
              {
                key: 'cancel',
                text: '取消',
                style: { color: '#9b9b9b', backgroundColor: '#eee' },
                onClick() {
                  handler.close()
                }
              },
              {
                key: 'confirm',
                text: '去登录',
                style: { color: '#2097c7' },
                onClick() {
                  handler.close()
                  router.pushView('sign-in')
                }
              },
            ]]
          })
          return;
        }
        router.pushView(self.url, {})
      }
    }} />
  )}</Observer>
}