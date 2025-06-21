import { PullToRefresh, List, InfiniteScroll } from 'antd-mobile'
import { Observer } from 'mobx-react-lite'
import ResourceItem from '@/adaptor'
import { FullWidth } from '../style'

export default function PageList({ disabled = false, display = '', style = {}, items, onRefresh, loadMore, hasMore = false, infinite = true, renderItems }) {
  return <Observer>{() => (
    <PullToRefresh disabled={disabled} onRefresh={onRefresh}>
      <List style={{
        "--padding-left": 0,
        "--padding-right": 0,
        "--border-inner": "none",
        "--adm-color-background": "transparent",
        padding: '0 5px',
        ...style
      }}>
        {renderItems ? renderItems(items) : items.map((item, i) => (
          <List.Item key={i}>
            <FullWidth style={{ gap: 5, marginBottom: 5 }}>
              {item.map(v => <ResourceItem key={v._id} item={v} type={display} />)}
            </FullWidth>
          </List.Item>
        ))}
      </List>
      {infinite && <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={10} />}
    </PullToRefresh>
  )}</Observer>
}