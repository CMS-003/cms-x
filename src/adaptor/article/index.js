import { Observer } from 'mobx-react-lite';
import Card from './card.js'
import LPRT from './lprt.js'

export default function Video({ item, display }) {
  return <Observer>{() => {
    if (display === 'card') {
      return <Card item={item} />
    } else if (display === 'lprt') {
      return <LPRT item={item} />
    } else {
      return <LPRT item={item} />
    }
  }}</Observer>
}