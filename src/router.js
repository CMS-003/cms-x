import React, { Fragment, useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
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
    return <Redirect to={'/home'}></Redirect>;
  } else {
    return <Redirect to={'/auth/login'}></Redirect>;
  }
}

export default function Router() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path={'/*'} component={Adaptor}></Route>
        <Route component={NoMatch} />
      </Switch>
    </BrowserRouter>
  );
}