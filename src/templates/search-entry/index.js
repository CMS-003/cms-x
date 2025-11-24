import { Observer, useLocalObservable } from "mobx-react-lite";
import { useRouter } from '@/global.js';
import styled from "styled-components";
import Auto from "@/groups/auto.js";
import { Input } from "antd-mobile";
import { Nav, SafeArea, FullHeight, FullHeightAuto } from "@/components";

const Btn = styled.div`
  background-color: lightblue;
  padding: 4px 10px;
  color: white;
  display: inline;
  border-radius: 5px;
  font-size: 14px;
`

export default function SearchEntry({ template }) {
  const router = useRouter()
  const local = useLocalObservable(() => ({
    compositing: false,
    q: '',
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
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter' && !local.compositing && local.q.trim()) {
                router.pushView('search-result', { q: local.q })
              }
            }}
          />}
          right={<span style={{ color: '#1677ff' }} onClick={() => {
            if (local.q.trim()) {
              router.pushView('search-result', { q: local.q })
            }
          }}>搜索</span>} />
        <FullHeightAuto style={{ overflow: 'hidden auto' }}>
          <Auto template={template} />
        </FullHeightAuto>
      </FullHeight>
    </SafeArea>
  )}</Observer>
}