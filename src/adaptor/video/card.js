import { Observer } from 'mobx-react-lite';
import styled from 'styled-components'
import { useStore, useRouter } from '@/contexts';

const ItemWrap = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
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

export default function VideoCard({ item }) {
  const router = useRouter();
  const store = useStore();
  return <Observer>{() => (
    <ItemWrap onClick={() => {
      router.pushView('Video', { id: item._id })
    }}>
      <div style={{ width: 120, height: 90, backgroundImage: `url(${store.app.imageLine + (item.thumbnail || item.poster || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
      <ItemTitle >{item.title}</ItemTitle>
    </ItemWrap>
  )}</Observer>
}