import { Observer } from "mobx-react-lite";

export default function HotArea({ self, children }) {
  return <Observer>{() => (
    <div>
      {children}
    </div>
  )}</Observer>
}