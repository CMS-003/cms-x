import { Observer } from "mobx-react-lite";
import { useRouter } from "@/contexts/index.js";
import SafeArea from "@/components/SafeArea/index.js";
import Acon from "@/components/Acon";
import Nav from "@/components/Nav";
import { FullHeight } from "@/components/style";

export default function Notify({ template }) {
  const router = useRouter();
  return <Observer>{() => (
    <SafeArea topBGC="#58abdd">
      <FullHeight>
        <Nav title={template.title} style={{ backgroundColor: '#58abdd' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', padding: '20px 0' }}>
          <Acon icon="Comment" title='评论回复' style={{ flexDirection: 'column' }} />
          <Acon icon="At" title='@我' style={{ flexDirection: 'column' }} />
          <Acon icon="Thumb" title='收到的赞' style={{ flexDirection: 'column' }} />
          <Acon icon="System" title='系统消息' color='lightblue' style={{ flexDirection: 'column' }} />
        </div>
      </FullHeight>
    </SafeArea>
  )}</Observer>
}