import { Observer } from "mobx-react-lite";
import Article from './article'
import Gallery from './gallery'
import Video from './video'
import Post from "./post";

export default function ResourceItem({ item, type }) {
  return <Observer>{() => {
    switch (item.type) {
      case 'article':
        return <Article item={item} type={type} />;
      case 'video':
        return <Video item={item} type={type} />;
      case 'animation':
        return <Video item={item} type={type} />;
      case 'image':
        return <Gallery item={item} type={type} />;
      case 'pixiv':
        return <Gallery item={item} type={type} />;
      case 'gallery':
        return <Gallery item={item} type={type} />;
      case 'post':
        return <Post item={item} type={type} />
      default:
        return <Video item={item} type={type} />;
    }
  }}</Observer>
}