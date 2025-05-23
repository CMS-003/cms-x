import { FullHeight, FullHeightAuto, FullHeightFix } from "@/components/style";
import { Observer } from "mobx-react-lite";
import Nav from "@/components/Nav";
import SafeArea from "@/components/SafeArea/index.js";

export default function ArticlePage() {
  return <Observer>{() => (
    <SafeArea>
      <FullHeight>
        <FullHeightFix>
          <Nav title={'文章详情'} />
        </FullHeightFix>
        <FullHeightAuto>

        </FullHeightAuto>
      </FullHeight>
    </SafeArea>
  )}</Observer>
}