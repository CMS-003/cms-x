
import { Observer } from 'mobx-react-lite'
import { useRouter } from "@/contexts/index.js";

export default function Layout({ self, children }) {
  const router = useRouter();
  return <Observer>{() => (
    <div style={{ display: 'flex', flexDirection: self.attrs.layout === 'horizontal' ? 'row' : 'column', ...self.style }} onClick={() => {
      if (self.widget.action === 'GOTO_PAGE') {
        router.pushView(self.url, {})
      }
    }}>
      {children}
    </div>
  )}</Observer>
}