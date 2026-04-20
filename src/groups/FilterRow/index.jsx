import styled from 'styled-components'
import { Observer } from 'mobx-react-lite'

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
const Row = styled.div`
  display: flex;
  align-items: flex-start;
`

export default function CFilterRow({ self, children, ...props }) {

  return <Observer>
    {() => (
      <Wrap>
        {children}
      </Wrap>
    )}
  </Observer>
}