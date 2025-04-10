import { Observer } from 'mobx-react-lite';
import styled from 'styled-components'
import { useStore, useRouter } from '@/contexts';

const ItemWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const ItemTitle = styled.div`
  overflow: hidden; 
  text-overflow: ellipsis; 
  display: -webkit-box; 
  -webkit-box-orient: vertical; 
  -webkit-line-clamp: 2;
  height: 34px;
  line-height: 17px;
  margin: 5px 0;
`

export default function VideoHalf({ item }) {
  const router = useRouter();
  const store = useStore();
  return <Observer>{() => (
    <ItemWrap onClick={() => {
      router.pushView('Video', { id: item._id })
    }}>
      <div style={{ borderRadius: 4, height: 120, backgroundImage: `url(${store.app.imageLine + (item.thumbnail || item.poster || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
      <ItemTitle >{item.title}</ItemTitle>
    </ItemWrap>
  )}</Observer>
}