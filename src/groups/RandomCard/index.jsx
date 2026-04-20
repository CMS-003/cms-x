
import { Observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Acon } from '@/components'

const Header = styled.div`
 font-weight: 600;
 font-size: 16px;
 padding: 5px;
 color: #555;
`
const Wrap = styled.div`
border-radius: 4px;
`
const Content = styled.div`
  min-height: 120px;
`
export default function CRandom({ self, mode, drag, dnd, children }) {
  return <Observer>{() => (
    <div
      style={{
        flex: 0,
        margin: '10px 10px 0',
        backgroundColor: '#fff',
        ...self.style,
      }}
    >
      {children}
      <Header>
        {self.title}
      </Header>
      <Wrap>
        <Content>

        </Content>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}><Acon icon='RefreshCw' /></div>
      </Wrap>
    </div>
  )}</Observer >
}