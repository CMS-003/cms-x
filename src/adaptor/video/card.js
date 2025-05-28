import { Observer } from 'mobx-react-lite';
import { useStore, useRouter } from '@/contexts';
import { ItemWrap, ItemTitle, Uname } from '../style'

export default function VideoCard({ item }) {
  const router = useRouter();
  const store = useStore();
  return <Observer>{() => (
    <ItemWrap onClick={() => {
      router.pushView('video', { id: item._id })
    }}>
      <div style={{ width: 120, height: 90, backgroundImage: `url(${store.app.imageLine + (item.thumbnail || item.poster || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
      <ItemTitle style={{ margin: '5px 0' }}>{item.title}</ItemTitle>
      <Uname style={{ padding: '0 0 5px 0' }}>{item.uname || '匿名'}</Uname>
    </ItemWrap>
  )}</Observer>
}