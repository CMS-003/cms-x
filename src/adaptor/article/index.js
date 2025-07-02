import { Observer } from 'mobx-react-lite';
import Card from './card.js'
import LPRT from './lprt.js'

export default function Video({ item, type }) {
  return <Observer>{() => {
    if (type === 'card') {
      return <Card item={item} />
    } else if (type === 'lprt') {
      return <LPRT item={item} />
    } else {
      return <LPRT item={item} />
    }
  }}</Observer>
}