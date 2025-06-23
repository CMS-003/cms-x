import { Observer } from "mobx-react-lite";
import { Nav, SafeArea, FullHeight, FullHeightAuto, FullHeightFix } from '@/components';

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