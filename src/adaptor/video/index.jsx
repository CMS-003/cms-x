import { Observer } from 'mobx-react-lite';
import Card from './card.jsx'
import Half from './half.jsx'
import LPRT from './LPRT.jsx'

export default function Video({ item, display }) {
  return <Observer>{() => {
    if (display === 'card') {
      return <Card item={item} />
    } else if (display === 'half') {
      return <Half item={item} />
    } else if (display === 'lprt') {
      return <LPRT item={item} />
    } else {
      return <Card item={item} />
    }
  }}</Observer>
}