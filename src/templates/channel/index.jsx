import { Observer } from "mobx-react-lite";
import Auto from "../../groups/auto.jsx";

export default function ChannelPage({ template }) {
  return <Observer>{() => (
    <Auto template={template} />
  )}</Observer>
}