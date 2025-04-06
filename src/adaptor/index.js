import { Observer } from "mobx-react-lite";
import Article from './article'
import Gallery from './gallery'
import Video from './video'

export default function ResourceItem({ item }) {
  return <Observer>{() => {
    switch (item.source_type) {
      case 'article':
        return <Article item={item} />;
      case 'video':
        return <Video item={item} />;
      case 'image':
        return <Gallery item={item} />;
      case 'gallery':
        return <Gallery item={item} />;
      default:
        return <Video item={item} />;
    }
  }}</Observer>
}