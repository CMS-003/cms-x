import { chunk } from "lodash";
import { Observer } from "mobx-react-lite";
import styled from "styled-components";
import { Component } from "../auto.js";
import { toJS } from "mobx";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`

export default function HotArea({ self }) {
  return <Observer>{() => (
    <div style={toJS(self.style)}>
      {chunk(self.children, self.attrs.colums || 4).map((rows, i) => (
        <Row key={i}>
          {rows.map(child => (
            <Component
              key={child._id}
              self={child}
            />
          ))}
        </Row>
      ))}
    </div>
  )}</Observer>
}