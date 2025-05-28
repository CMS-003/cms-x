import { Observer } from "mobx-react-lite";
import { useRouter } from "@/contexts/index.js";
import SafeArea from "@/components/SafeArea/index.js";
import Acon from "@/components/Acon";
import Nav from "@/components/Nav";

export default function Notify({ template }) {
  const router = useRouter();
  return <Observer>{() => (
    <SafeArea topBGC="lightblue">
      <Nav title={template.title} style={{ backgroundColor: 'lightblue' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
        <Acon icon="messages" />
        <Acon icon="like" />
        <Acon icon="At" />
        <Acon icon="System" />
      </div>
    </SafeArea>
  )}</Observer>
}