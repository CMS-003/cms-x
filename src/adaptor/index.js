import { Observer } from "mobx-react-lite";
import Article from './article'
import Gallery from './gallery'
import Video from './video'
import Post from "./post";

export default function ResourceItem({ item, type }) {
  return <Observer>{() => {
    switch (item.type) {
      case 1:
        return <Article item={item} type={type} />;
      case 2:
        return <Video item={item} type={type} />;
      case 3:
        return <Gallery item={item} type={type} />;
      case 9:
        return <Video item={item} type={type} />;
      case 11:
        return <Post item={item} type={type} />
      default:
        return <Video item={item} type={type} />;
    }
  }}</Observer>
}