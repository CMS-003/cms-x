import { Observer, useLocalObservable } from "mobx-react-lite";
import { Fragment, useCallback } from "react";
import { useEffectOnce } from "react-use";
import apis from '../../apis'
import Auto from "../../groups/auto.js";

export default function Dynamic(props) {
  const id = props.id || '';
  const local = useLocalObservable(() => ({
    isLoading: false,
    template: null,
    components: [],
    isError: false,
    page: 1,
  }));
  const getData = useCallback(async () => {
    local.isLoading = true;
    console.log('??')
    const resp = await apis.getPageComponents(id, local.page)
    local.isLoading = false;
    if (resp.code === 0) {
      local.template = resp.data.item;
      local.components = resp.data.items;
    } else {
      local.isError = true;
    }
  }, [id, local])
  useEffectOnce(() => {
    if (local.template === null && !local.isLoading) {
      getData();
    }
    return () => {

    }
  })
  return <Observer>{() => {
    if (local.isError) {
      return <div>error</div>
    }
    return (
      <Fragment>
        <Auto components={local.components} />
      </Fragment>
    )
  }}</Observer>
}