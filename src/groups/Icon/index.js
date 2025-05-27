import { Observer } from "mobx-react-lite";
import Acon from '../../components/Acon'
import { useRouter } from "@/contexts/index.js";

export default function Icon({ self }) {
  const router = useRouter();
  return <Observer>{() => (
    <Acon icon={self.icon || 'PlusOutlined'} title={self.title} style={{ width: 24, height: 24, ...(self.style) }} onClick={() => {
      if (self.widget.action === 'GOTO_PAGE') {
        router.pushView(self.url, {})
      }
    }} />
  )}</Observer>
}