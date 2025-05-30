import { FullHeight, FullHeightAuto } from "@/components/style.js";
import { Observer } from "mobx-react-lite";
import RouterContext from "@/contexts/router.js";
import { useContext } from "react";
import styled from "styled-components";
import Auto from "@/groups/auto.js";
import SafeArea from "@/components/SafeArea/index.js";
import Nav from "@/components/Nav/index.js";
import { Input } from "antd-mobile";

const Btn = styled.div`
  background-color: lightblue;
  padding: 4px 10px;
  color: white;
  display: inline;
  border-radius: 5px;
  font-size: 14px;
`

export default function Search({ template }) {
  const router = useContext(RouterContext)
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