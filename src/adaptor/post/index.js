import { Observer } from 'mobx-react-lite';
import { ItemWrap, Uname } from '../style'
import { store, useRouter, readableTime } from '@/global.js'
import styled from 'styled-components';
import { FullWidth } from '@/components';

export const ItemTitle = styled.div`
  overflow: hidden; 
  text-overflow: ellipsis; 
  display: -webkit-box; 
  -webkit-box-orient: vertical; 
  -webkit-line-clamp: 1;
  line-height: 14px;
  margin: 10px 10px 0;
  font-size: 12px;
`
const ScrollWrap = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: auto;
  box-sizing: border-box;
  margin-top: 10px;
  margin-bottom: 10px;
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
  return <Observer>{() => (
    <ItemWrap onClick={() => {
      router.pushView('post', { id: item._id })
    }}>
      <FullWidth style={{ fontSize: 14, padding: '10px 0 0 10px' }}>
        <span>{item.uname || '匿名'}</span>
        <span style={{ marginLeft: 10, fontSize: 12, color: 'grey' }}>
          发布于 {readableTime(new Date(item.publishedAt))}
        </span>
      </FullWidth>
      {item.title || item.content ? <ItemTitle >{item.title || item.content}</ItemTitle> : null}
      <ScrollWrap>
        {item.images && item.images.map(image => (
          <div key={image._id} style={{ width: 120, marginLeft: 10, height: 90, flexShrink: 0, backgroundColor: 'black', backgroundImage: `url(${store.app.imageLine + (image.path || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
        ))}
        {item.videos && item.videos.map(video => (
          <video key={video._id} style={{ width: 120, marginLeft: 10, height: 90, flexShrink: 0, backgroundColor: 'black', backgroundSize: 'cover', backgroundPosition: 'center center' }} preload='metadata' src={`${store.app.videoLine + (video.path || '/images/poster/nocover.jpg')}`}></video>
        ))}
      </ScrollWrap>
    </ItemWrap>
  )}</Observer>
}