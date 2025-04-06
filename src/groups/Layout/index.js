
import { Observer } from 'mobx-react-lite'

export default function Layout({ self, children }) {
  return <Observer>{() => (
    <div style={{ display: 'flex', flexDirection: self.attrs.layout === 'horizontal' ? 'row' : 'column', ...self.style }}>
      {children}
    </div>
  )}</Observer>
}