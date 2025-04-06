import { FullHeight, FullHeightAuto, FullHeightFix } from '../../components/style'
import { toJS } from 'mobx';
import { Observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';

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
  }));
  const getData = useCallback(async () => {
    console.log(self.api)
  }, [local.page]);
  return <Observer>
    {() => (
      <FullHeight style={toJS(self.style)}>
        <FullHeightFix style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          {self.children.map(child => (
            <Wrap key={child._id}>
              {child.children.map(sun => (
                <Tag style={sun.attrs.selected ? { color: 'white', backgroundColor: '#3498db', border: '1px solid #3498db' } : { color: '#bbb', backgroundColor: 'white', border: '1px solid #bbb' }} onClick={() => {
                  child.children.forEach(v => {
                    v.attrs.selected = v._id === sun._id
                  });
                  getData();
                }}>{sun.title}</Tag>
              ))}
            </Wrap>
          ))}
        </FullHeightFix>
        <FullHeightAuto>
          resources
        </FullHeightAuto>
      </FullHeight>
    )}
  </Observer>
}