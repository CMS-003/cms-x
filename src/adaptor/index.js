import { Observer } from "mobx-react-lite";
import Article from './article'
import Gallery from './gallery'
import Video from './video'

export default function ResourceItem({ item, type }) {
  return <Observer>{() => {
    switch (item.source_type) {
      case 'article':
        return <Article item={item} type={type} />;
      case 'video':
        return <Video item={item} type={type} />;
      case 'animation':
        return <Video item={item} type={type} />;
      case 'image':
        return <Gallery item={item} type={type} />;
      case 'gallery':
        return <Gallery item={item} type={type} />;
      default:
        return <Video item={item} type={type} />;
    }
  }}</Observer>
}