import { Observer } from "mobx-react-lite";
import Widgets from './index.js'
import { toJS } from "mobx";

export function Component({ self }) {
  const Widget = Widgets[self.type];
  if (!Widget) {
    return <div>NotFound: {self.type}</div>
  }
  return <Observer>{() => (
    <Widget self={self} >
      {self.children.map(child => (
        <Component key={child._id} self={child} />
      ))}
    </Widget>
  )}</Observer>
}

export default function Auto({ template }) {
  return <Observer>{() => (
    <div style={toJS(template.style)}>
      {template.children.map(component => <Component key={component._id} self={component} />)}
    </div>
  )}</Observer>
}