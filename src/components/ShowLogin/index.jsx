import { Dialog } from "antd-mobile";

export default function ShowLogin({ router }) {
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
