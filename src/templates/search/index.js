import { Observer } from "mobx-react-lite";
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

export default function Search({ template }) {
  const router = useRouter()
  return <Observer>{() => (
    <SafeArea>
      <FullHeight>
        <Nav left={<Input placeholder="请输入" style={{ border: '1px solid #333', boxSizing: 'border-box', borderRadius: 20, padding: '0 10px', fontSize: 16 }} />} />
        <FullHeightAuto style={{ overflow: 'hidden auto' }}>
          <Auto template={template} />
        </FullHeightAuto>
      </FullHeight>
    </SafeArea>
  )}</Observer>
}