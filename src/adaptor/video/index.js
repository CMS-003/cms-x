import { Observer } from 'mobx-react-lite';
import Card from './card.js'
import Half from './half.js'
import LPRT from './LPRT.js'

export default function Video({ item, type }) {
  return <Observer>{() => {
    if (type === 'card') {
      return <Card item={item} />
    } else if (type === 'half') {
      return <Half item={item} />
    } else if (type === 'lprt') {
      return <LPRT item={item} />
    } else {
      return <Card item={item} />
    }
  }}</Observer>
}