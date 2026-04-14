import { Observer } from 'mobx-react-lite';
import { ItemWrap, ItemTitle, Uname } from '../style'
import { store, useRouter } from '@/global.js';

export default function Gallery({ item }) {
  const router = useRouter();
  return <Observer>{() => (
    <ItemWrap onClick={() => {
      router.pushView('gallery', { id: item._id })
    }}>
      <div style={{ height: 90, backgroundImage: `url(${store.app.imageLine + (item.cover || item.poster || item.thumbnail || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
      <ItemTitle >{item.title}</ItemTitle>
      <Uname>{item.uname || '匿名'}</Uname>
    </ItemWrap>
  )}</Observer>
}