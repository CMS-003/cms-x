import React, { Fragment } from 'react'
import { PullToRefresh, List, InfiniteScroll } from 'antd-mobile'
import { Observer } from 'mobx-react-lite'
import ResourceItem from '@/adaptor'
import { FullWidth } from '../style'

export default function PageList({ items, onRefresh, loadMore, multi = false, hasMore = false, infinite = true }) {
  return <Observer>{() => (
    <PullToRefresh onRefresh={onRefresh}>
      <List style={{
        "--padding-left": 0,
        "--padding-right": 0,
        "--border-inner": "none",
      }}>
        {items.map((item, i) => (
          <List.Item key={i}>
            {
              multi
                ? <FullWidth style={{ gap: 10 }}>
                  {item.map(v => <ResourceItem key={v._id} item={v} type="half" />)}
                </FullWidth>
                : <ResourceItem key={item._id} item={item} />
            }
          </List.Item>
        ))}
      </List>
      {infinite && <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={10} />}
    </PullToRefresh>
  )}</Observer>
}