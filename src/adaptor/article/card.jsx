import { Observer } from 'mobx-react-lite';
import { useRouter } from '@/global.js'
import { ItemWrap, ItemTitle, Uname } from '../style'

export default function Article({ item }) {
  const router = useRouter()
  return <Observer>{() => (
    <ItemWrap onClick={() => {
      router.pushView('article', { id: item._id })
    }}>
      <div style={{ width: 120, height: 90, backgroundImage: `url(${(item.cover || item.poster || item.thumbnail || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
      <ItemTitle >{item.title}</ItemTitle>
      <Uname>{item.uname || '匿名'}</Uname>
    </ItemWrap>
  )}</Observer>
}