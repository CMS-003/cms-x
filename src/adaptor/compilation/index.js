import { Observer } from 'mobx-react-lite';
import { readableTime, useRouter } from '@/global.js'
import { ItemWrap } from '../style'
import { FullWidth, FullWidthAuto } from '@/components/index.js';

export default function Compilation({ item }) {
  const router = useRouter()
  const picture = item.poster
  return <Observer>{() => (
    <ItemWrap style={{ flexDirection: 'row', alignItems: 'center', alignItems: 'stretch' }} onClick={() => {
      router.pushView('compilation', { id: item._id })
    }}>
      <div style={{ width: 120, minHeight: 90, backgroundImage: `url(${(picture || '/images/poster/nocover.jpg')})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', flexShrink: 0, flexGrow: 0, backgroundPosition: 'center center' }}></div>
      <div style={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
        <div>{item.title}<span style={{ fontSize: 12, color: '#999' }}>(共{item.total}部)</span></div>
        <span style={{ fontSize: 12, color: '#999' }}>{item.desc}</span>
        <FullWidth style={{ fontSize: 12, color: 'grey' }}>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>更新于 {readableTime((new Date(item.createdAt)))}</span>
          <FullWidthAuto></FullWidthAuto>
        </FullWidth>
      </div>
    </ItemWrap>
  )}</Observer>
}