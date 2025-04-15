import _ from 'lodash'
import { useCallback } from 'react';
import { useEffectOnce } from 'react-use';
import { toJS } from 'mobx';
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
  padding: 2px 0;
  width: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
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
    getQuery() {
      const ids = [self._id];
      self.children.forEach(child => {
        child.children.forEach(sun => {
          if (sun.attrs.selected) {
            ids.push(sun._id)
          }
        });
      });
      return ids.join(',');
    },
    setResources(resources) {
      local.resources = resources;
    }
  }));
  const getData = useCallback(async () => {
    const qid = local.getQuery()
    try {
      local.loading = true;
      const resp = await apis.getResourceList({ qid, page: local.page, size: 20 });
      if (resp.code === 0) {
        local.page === 1 ? local.setResources(resp.data.items) : local.setResources(local.resources.concat(resp.data.items))
        local.hasMore = resp.data.items.length > 0;
      }
    } catch (e) {
      console.log(e);
    } finally {
      local.loading = false
    }
  }, []);
  const getMore = useCallback(async () => {
    if (local.loading) return;
    local.page++;
    await getData();
  }, [])
  useEffectOnce(() => {
    if (local.resources.length === 0) {
      getData();
    }
  })
  return <Observer>
    {() => (
      <FullHeight style={toJS(self.style)}>
        <FullHeightFix style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          {self.children.map(child => (
            <Wrap key={child._id}>
              {child.children.map(sun => (
                <Tag key={sun._id} style={sun.attrs.selected ? { color: 'white', backgroundColor: '#3498db', border: '1px solid #3498db' } : { color: '#bbb', backgroundColor: 'white', border: '1px solid #bbb' }} onClick={() => {
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
        <FullHeightAuto>
          <List
            multi={true}
            items={_.chunk(local.resources, 2)}
            onRefresh={async () => {
              local.page = 1;
              await getData();
            }}
            loadMore={getMore}
            hasMore={local.hasMore}
          />
        </FullHeightAuto>
      </FullHeight>
    )}
  </Observer>
}