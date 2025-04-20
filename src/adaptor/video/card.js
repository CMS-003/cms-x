import { Observer } from 'mobx-react-lite';
import { useStore, useRouter } from '@/contexts';
import { ItemWrap, ItemTitle, Uname } from '../style'

export default function VideoCard({ item }) {
  const router = useRouter();
  const store = useStore();
  return <Observer>{() => (
    <ItemWrap onClick={() => {
      router.pushView('Video', { id: item._id })
    }}>
      <div style={{ width: 120, height: 90, backgroundImage: `url(${store.app.imageLine + (item.thumbnail || item.poster || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
      <ItemTitle >{item.title}</ItemTitle>
      <Uname>{item.uname}</Uname>
    </ItemWrap>
  )}</Observer>
}