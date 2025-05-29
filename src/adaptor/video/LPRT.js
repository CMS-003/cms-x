import { Observer } from 'mobx-react-lite';
import { useStore, useRouter } from '@/contexts';
import { ItemWrap, ItemTitle, Uname } from '../style'

export default function VideoLPRT({ item }) {
  const router = useRouter();
  const store = useStore();
  return <Observer>{() => (
    <ItemWrap style={{ flexDirection: 'row' }} onClick={() => {
      router.pushView('video', { id: item._id })
    }}>
      <div style={{ width: 120, height: 80, backgroundImage: `url(${store.app.imageLine + (item.cover || item.poster || item.thumbnail || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <ItemTitle >{item.title}</ItemTitle>
        <Uname>{item.uname || '匿名'}</Uname>
      </div>
    </ItemWrap>
  )}</Observer>
}