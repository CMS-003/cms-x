import React, { Fragment, useContext, useMemo } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router';
import store from './store';
import { Observer } from 'mobx-react-lite';
import RouterContext from './contexts/router.js';
import styled from 'styled-components';
import { motion, AnimatePresence } from "motion/react"
import Template from './templates/index.js';
import Dynamic from './templates/dynamic/index.js';

const LayerWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`
const Layer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
`

function Adaptor() {
  const router = useContext(RouterContext);
  return (
    <Observer>{() => (
      <LayerWrap>
        <AnimatePresence>
          {router.views.map((view, n) => {
            if (n === 0) {
              return <Template id={'demo'} key={n} />;
            }
            const View = router.getViewPage(view.view, view.query['id'])
            return <motion.div
              key={n}
              initial={{ left: '100%' }}
              animate={{ left: 0 }}
              exit={{ left: '100%' }}
              style={{ zIndex: 10 + n, position: 'absolute', top: 0, width: '100%', height: '100%', backgroundColor: '#eee' }}
            >
              <View id={view.query.id} />
            </motion.div>
          })}
        </AnimatePresence>
      </LayerWrap>
    )
    }</Observer >
  )
}

function NoMatch() {
  if (store.user.isLogin) {
    return <Navigate to={'/demo/home'}></Navigate>;
  } else {
    return <Navigate to={'/demo/login'}></Navigate>;
  }
}

export default function Router() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path={'/demo/*'} element={<Adaptor />}></Route>
        <Route element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}