import { Observer } from 'mobx-react-lite';
import { ItemWrap, ItemTitle, Uname } from '../style'
import store from '@/store';
import { useStore, useRouter } from '@/contexts';
import styled from 'styled-components';

const ScrollWrap = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: auto;
  box-sizing: border-box;
  margin-top: 10px;
  &::-webkit-scrollbar {
    display: none;
  }
  &>div:first-child {
    margin-left: 0;
  }
`;
const ScrollItem = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`
export default function Post({ item }) {
  const router = useRouter();
  const store = useStore();
  return <Observer>{() => (
    <ItemWrap onClick={() => {
      router.pushView('post', { id: item._id })
    }}>
      <ScrollWrap>
        {item.images.map(image => (
          <div key={image._id} style={{ width: 120, marginLeft: 10, height: 90, backgroundImage: `url(${store.app.imageLine + (image.path || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
        ))}
        {item.videos.map(video => (
          <video key={video._id} style={{ width: 120, marginLeft: 10, height: 90, backgroundSize: 'cover', backgroundPosition: 'center center' }} preload='metadata' src={`${store.app.videoLine + (video.path || '/images/poster/nocover.jpg')}`}></video>
        ))}
      </ScrollWrap>
      <ItemTitle >{item.title}</ItemTitle>
      <Uname>{item.uname || '匿名'}</Uname>
    </ItemWrap>
  )}</Observer>
}