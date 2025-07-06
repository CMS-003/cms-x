import { Observer } from 'mobx-react-lite';
import { readableTime, useRouter } from '@/global.js'
import { ItemWrap, ItemTitle, Uname } from '../style'
import { FullHeightAuto, FullWidth, FullWidthAuto } from '@/components/index.js';
import { Tag } from 'antd-mobile';

export default function Article({ item }) {
  const router = useRouter()
  const picture = item.cover || item.poster || item.thumbnail
  return <Observer>{() => (
    <ItemWrap style={{ flexDirection: 'row', alignItems: 'center' }} onClick={() => {
      router.pushView('article', { id: item._id })
    }}>
      {picture ? <div style={{ width: 100, height: 70, backgroundImage: `url(${(picture || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}></div> : null}
      <div style={{ flex: 1 }}>
        <ItemTitle style={{ lineHeight: 1.2 }}>{item.title}</ItemTitle>
        <FullWidth style={{ fontSize: 12, color: 'grey', margin: '0 5px 5px 5px' }}>
          <Uname style={{ padding: 0 }}>{item.uname || '匿名'}</Uname>
          <span style={{ margin: '0 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>发布于 {readableTime((new Date(item.publishedAt)))}</span>
          <FullWidthAuto></FullWidthAuto>
          <FullHeightAuto style={{ display: 'flex', flex: '0 0 100px', height: 20, overflow: 'hidden', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
            {item.tags.map((tag, i) => <Tag key={i} round color='#2db7f5' style={{ padding: '2px 4px', margin: '2px 0' }}>{tag}</Tag>)}
          </FullHeightAuto>
        </FullWidth>
      </div>
    </ItemWrap>
  )}</Observer>
}