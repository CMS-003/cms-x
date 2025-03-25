import React, { Fragment, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router';
import store from './store';
import { Observer } from 'mobx-react-lite';

function Adaptor() {
  return (
    <Observer>{() => (
      <Fragment>
        layers
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