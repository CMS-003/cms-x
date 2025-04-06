import { Observer } from "mobx-react-lite";
import Acon from '../../components/Acon'

export default function Icon({ self, children }) {
  return <Observer>{() => (
    <Acon icon={self.icon || 'PlusOutlined'} style={{ width: 24, height: 24, ...(self.style) }} />
  )}</Observer>
}