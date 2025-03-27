import React, { Fragment, useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router';
import store from './store';
import { Observer } from 'mobx-react-lite';
import RouterContext from './contexts/router.js';
import styled from 'styled-components';

const Layer = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
`

function Adaptor() {
  const router = useContext(RouterContext);
  return (
    <Observer>{() => (
      <Fragment>
        {router.views.map(view => {
          const View = router.getViewPage(view.view, view.query['id'])
          return <Layer>
            <View id={view.query.id} />
          </Layer>
        })}
      </Fragment>
    )}</Observer>
  )
}

function NoMatch() {
  if (store.user.isLogin) {
    return <Navigate to={'/demo'}></Navigate>;
  } else {
    return <Navigate to={'/demo/auth/login'}></Navigate>;
  }
}

export default function Router() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path={'/demo'} element={<Adaptor />}></Route>
        <Route element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}