import { FullHeight, FullHeightAuto, FullHeightFix } from "@/components/style";
import { Observer } from "mobx-react-lite";
import Nav from "@/components/Nav";

export default function ArticlePage() {
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix>
        <Nav title={'文章详情'} />
      </FullHeightFix>
      <FullHeightAuto>

      </FullHeightAuto>
    </FullHeight>
  )}</Observer>
}