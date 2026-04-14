import { Observer } from 'mobx-react-lite';
import { store, useRouter } from '@/global.js';
import { ItemWrap, ItemImage, ItemTitle, Uname } from '../style'

export default function VideoHalf({ item }) {
  const router = useRouter();
  return <Observer>{() => (
    <ItemWrap onClick={() => {
      router.pushView('video', { id: item._id })
    }}>
      {/* <div style={{ height: 120, backgroundImage: `url(${store.app.imageLine + (item.thumbnail || item.poster || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div> */}
      <ItemImage style={{ height: 120, backgroundImage: `url(${store.app.imageLine + (item.thumbnail || item.poster || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }} />
      <ItemTitle >{item.title}</ItemTitle>
      <Uname>{item.uname || '匿名'}</Uname>
    </ItemWrap>
  )}</Observer>
}