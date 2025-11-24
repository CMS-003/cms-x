import { Observer } from "mobx-react-lite";
import Article from './article'
import Gallery from './gallery'
import Video from './video'
import Post from "./post";
import User from "./user";

export default function ResourceItem({ item, display }) {
  return <Observer>{() => {
    switch (item.type) {
      case 1:
        return <Article item={item} display={display} />;
      case 2:
        return <Video item={item} display={display} />;
      case 3:
        return <Gallery item={item} display={display} />;
      case 9:
        return <Video item={item} display={display} />;
      case 11:
        return <Post item={item} display={display} />
      case 13:
        return <User item={item} display={display} />
      default:
        return <Video item={item} display={display} />;
    }
  }}</Observer>
}