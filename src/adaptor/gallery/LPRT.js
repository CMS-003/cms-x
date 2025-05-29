import { Observer } from 'mobx-react-lite';
import { ItemWrap, ItemTitle, Uname } from '../style'
import store from '@/store';
import { useStore, useRouter } from '@/contexts';

export default function Gallery({ item }) {
  const router = useRouter();
  const store = useStore();
  return <Observer>{() => (
    <ItemWrap style={{ flexDirection: 'row' }} onClick={() => {
      router.pushView('gallery', { id: item._id })
    }}>
      <div style={{ width: 120, height: 80, backgroundImage: `url(${store.app.imageLine + (item.cover || item.poster || item.thumbnail || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <ItemTitle >{item.title}</ItemTitle>
        <Uname>{item.uname || '匿名'}</Uname>
      </div>
    </ItemWrap>
  )}</Observer>
}