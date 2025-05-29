import _ from 'lodash'
import { Fragment, useCallback, useEffect } from 'react';
import { action, toJS } from 'mobx';
import { Observer, useLocalObservable } from 'mobx-react-lite';
import styled from 'styled-components';
import { FullHeight, FullHeightAuto, FullHeightFix } from '../../components/style'
import apis from '@/apis/index.js';
import List from '@/components/List';

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  overflow-x: auto;
  padding-top: 5px;
  width: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
`
const ShortWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #eee;
  z-index: 2;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
`
const Tag = styled.span`
  display: inline-block;
  border-radius: 2px;
  padding: 2px 4px;
  margin-right: 4px;
  white-space: nowrap;
  font-size: 11px;
`
export default function CFilter({ self }) {
  const local = useLocalObservable(() => ({
    loading: true,
    resources: [],
    page: 1,
    hasMore: true,
    // 顶部高度
    headHeight: 'auto',
    // 顶部状态: default,fixShort,fixHead
    headStatus: 'default',
    getQuery() {
      const ids = [...self.queries];
      self.children.forEach(child => {
        child.children.forEach(sun => {
          if (sun.attrs.selected) {
            ids.push(...sun.queries)
          }
        });
      });
      return ids.join(',');
    },
    setResources(resources) {
      local.resources = resources;
    },
    setHeadHeight: action((height) => {
      local.headHeight = height;
    }),
    setHeadStatus: action((status) => {
      local.headStatus = status;
    }),
    setHasMore: action((has) => {
      local.hasMore = has;
    }),
  }));
  const getData = useCallback(async () => {
    const qid = local.getQuery()
    try {
      local.loading = true;
      const resp = self.widget.action === 'FETCH' ? await apis.fetchAPI(self.widget.method, self.url) : await apis.getResourceList({ qid, page: local.page, size: 20 });
      if (resp.code === 0) {
        local.page === 1 ? local.setResources(resp.data.items) : local.setResources(local.resources.concat(resp.data.items))
        local.setHasMore(resp.data.items.length > 0)
      }
    } catch (e) {
      local.hasMore = false;
    } finally {
      local.loading = false
    }
  }, []);
  const getMore = useCallback(async () => {
    if (local.loading || !local.hasMore) return;
    local.page++;
    await getData();
  }, [])
  useEffect(() => {
    if (local.resources.length === 0) {
      getData();
    }
  }, [])
  return <Observer>
    {() => (
      <div style={{ height: '100%', position: 'relative' }}>
        <div style={{ height: '100%', overflow: 'auto', ...toJS(self.style) }} onScroll={e => {
          if (local.headHeight !== 'auto') {
            local.setHeadStatus(e.currentTarget.scrollTop > local.headHeight ? 'fixShort' : 'default')
          }
          if (local.headStatus !== 'fixShort' && local.headHeight !== 'auto' && e.currentTarget.scrollTop > local.headHeight) {
            local.setHeadStatus('fixShort');
          }
        }}>
          <div style={{ height: local.headHeight }}>
            <FullHeightFix style={{ position: local.headStatus === 'fixHead' ? 'absolute' : 'static', top: 0, left: 0, flexDirection: 'column', alignItems: 'flex-start', width: '100%', zIndex: 2, padding: '0 5px 5px', boxSizing: 'border-box', backgroundColor: '#eee' }} ref={ref => {
              if (ref && local.headHeight === 'auto') {
                local.setHeadHeight(ref.offsetHeight)
              }
            }}>
              {self.children.map(child => (
                <Wrap key={child._id}>
                  {child.children.map(sun => (
                    <Tag key={sun._id} style={sun.attrs.selected ? { color: 'white', backgroundColor: '#3498db' } : { color: '#bbb', backgroundColor: 'white' }} onClick={() => {
                      child.children.forEach(v => {
                        v.attrs.selected = v._id === sun._id
                      });
                      local.page = 1;
                      getData();
                    }}>{sun.title}</Tag>
                  ))}
                </Wrap>
              ))}
            </FullHeightFix>
            <ShortWrap style={{ display: local.headStatus === 'fixShort' ? 'flex' : 'none' }} onClick={() => local.setHeadStatus('fixHead')}>
              {self.children.map(child => (
                <Fragment key={child._id}>
                  {child.children.map(sun => (
                    sun.attrs.selected ? <Tag key={sun._id} style={{ color: 'white', backgroundColor: '#3498db' }}>{sun.title}</Tag> : null
                  ))}
                </Fragment>
              ))}
            </ShortWrap>
          </div>
          <List
            display={self.attrs.display}
            multi={self.attrs.columns !== 1}
            items={_.chunk(local.resources, self.attrs.columns)}
            onRefresh={async () => {
              local.page = 1;
              await getData();
            }}
            loadMore={getMore}
            hasMore={local.hasMore}
          />
        </div>
      </div>
    )}
  </Observer>
}