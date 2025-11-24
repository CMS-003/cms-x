import { Observer } from 'mobx-react-lite';
import Card from './card.js'
import Half from './half.js'
import LPRT from './LPRT.js'

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