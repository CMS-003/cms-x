import { Observer, useLocalObservable } from "mobx-react-lite";
import { useRouter } from '@/global.js';
import styled from "styled-components";
import Auto from "@/groups/auto.js";
import { Input } from "antd-mobile";
import { Nav, SafeArea, FullHeight, FullHeightAuto } from "@/components";
import { useQuery } from "@/contexts";
import QueryContext from "@/contexts/query";
import events from "@/utils/event";
import { omit } from "lodash";

const Btn = styled.div`
  background-color: lightblue;
  padding: 4px 10px;
  color: white;
  display: inline;
  border-radius: 5px;
  font-size: 14px;
`

export default function SearchResult({ template }) {
  const router = useRouter()
  const query = useQuery();
  const local = useLocalObservable(() => ({
    compositing: false,
    q: decodeURI(query.q || ''),
    setComposition(b) {
      local.compositing = b;
    },
    setQ(txt) {
      local.q = txt.trim();
    }
  }))
  return <Observer>{() => (
    <SafeArea>
      <FullHeight>
        <Nav
          left={<Input
            defaultValue={local.q}
            placeholder="请输入"
            style={{
              '--font-size': 14,
              display: 'flex',
              border: '0.5px solid #333',
              boxSizing: 'border-box',
              borderRadius: 20,
              margin: '0 10px',
              padding: '4px 10px',
            }}
            onCompositionStart={() => {
              local.setComposition(true)
            }}
            onCompositionEnd={() => {
              local.setComposition(false)
            }}
            onChange={(txt) => {
              local.setQ(txt)
            }} />}
          right={<span style={{ color: '#1677ff' }} onClick={() => {
            events.emit('reset', { template: omit(template, ['children']) })
          }}>搜索</span>} />
        <FullHeightAuto style={{ overflow: 'hidden auto' }}>
          <QueryContext.Provider value={local}>
            <Auto template={template} />
          </QueryContext.Provider>
        </FullHeightAuto>
      </FullHeight>
    </SafeArea>
  )}</Observer>
}