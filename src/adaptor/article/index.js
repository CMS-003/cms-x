import { useContext } from 'react';
import { Observer } from 'mobx-react-lite';
import styled from 'styled-components'
import RouterContext from '@/contexts/router.js';
import { ItemWrap, ItemTitle, Uname } from '../style'

export default function Article({ item }) {
  const router = useContext(RouterContext);
  return <Observer>{() => (
    <ItemWrap onClick={() => {
      router.pushView('Article', { id: item._id })
    }}>
      <div style={{ width: 120, height: 90, backgroundImage: `url(${"http://192.168.0.124" + (item.cover || item.poster || item.thumbnail || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div>
      <ItemTitle >{item.title}</ItemTitle>
      <Uname>{item.uname || '匿名'}</Uname>
    </ItemWrap>
  )}</Observer>
}