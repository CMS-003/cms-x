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
        "--adm-color-background": "transparent",
        padding: '0 5px'
      }}>
        {items.map((item, i) => (
          <List.Item key={i}>
            {
              multi
                ? <FullWidth style={{ gap: 5, marginBottom: 5 }}>
                  {item.map(v => <ResourceItem key={v._id} item={v} type="half" />)}
                </FullWidth>
                : <FullWidth style={{ gap: 5, marginBottom: 5 }}>
                  {item.map(v => <ResourceItem key={v._id} item={v} />)}
                </FullWidth>
            }
          </List.Item>
        ))}
      </List>
      {infinite && <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={10} />}
    </PullToRefresh>
  )}</Observer>
}