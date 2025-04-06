import { Observer } from 'mobx-react-lite';
import styled from 'styled-components'

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

export default function Article({ item }) {
  return <Observer>{() => (
    <ItemWrap>
      <div style={{ width: 120, height: 90, backgroundImage: `url(${"http://192.168.0.124" + (item.cover || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
      <ItemTitle >{item.title}</ItemTitle>
    </ItemWrap>
  )}</Observer>
}