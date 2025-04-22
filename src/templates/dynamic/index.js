import { Observer, useLocalObservable } from "mobx-react-lite";
import { Fragment, useCallback } from "react";
import { useEffectOnce } from "react-use";
import apis from '../../apis'
import Auto from "../../groups/auto.js";
import { CenterXY } from "@/components/style.js";
import { SpinLoading } from 'antd-mobile'

export default function Dynamic(props) {
  const id = props.id || '';
  const local = useLocalObservable(() => ({
    isLoading: false,
    template: props.template,
    isError: false,
    page: 1,
    setValue(key, value) {
      local[key] = value
    }
  }));
  const getData = useCallback(async () => {
    local.isLoading = true;
    const resp = await apis.getTemplate(id)
    if (resp.code === 0) {
      local.setValue('template', resp.data);
    } else {
      local.isError = true;
    }
    local.isLoading = false;
  }, [id, local])
  useEffectOnce(() => {
    if (!local.template && !local.isLoading) {
      getData(id);
    }
    return () => {

    }
  })
  return <Observer>{() => {
    if (local.isError) {
      return <div>error</div>
    }
    if (!local.template) {
      return <CenterXY>
        <SpinLoading color='primary' />
      </CenterXY>
    }
    return (
      <Fragment>
        <Auto template={local.template} />
      </Fragment>
    )
  }}</Observer>
}