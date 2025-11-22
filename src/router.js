import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router';
import store from './store';
import { Observer } from 'mobx-react-lite';
import RouterContext from './contexts/router.js';
import styled from 'styled-components';
import { motion, AnimatePresence } from "motion/react"
import Template from './templates/index.js';

const LayerWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

function Adaptor() {
  const router = useContext(RouterContext);
  const navigate = useNavigate();
  useEffect(() => {
    // 监听 popstate 事件（后退/前进）
    const handleBack = (event) => {
      // console.log('是否手动返回：', router.clicked);
      if (!router.clicked) {
        router.popView()
      }
      setTimeout(() => {
        router.setClicked(false)
      }, 200)
    };

    window.addEventListener('popstate', handleBack);

    return () => {
      window.removeEventListener('popstate', handleBack);
    };
  }, [navigate]);
  return (
    <Observer>{() => (
      <LayerWrap>
        <AnimatePresence>
          {router.views.map((view, n) => {
            if (n === 0) {
              return <Template view={APP} key={n} />;
            }
            const View = router.getViewPage(view.view, view.query['id'])
            return <motion.div
              key={n}
              initial={{ left: '100%' }}
              animate={{ left: 0 }}
              exit={view.animate ? { left: '100%' } : false}
              style={{ zIndex: 10 + n, position: 'absolute', top: 0, width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#eee' }}
            >
              <View id={view.query.id} active={n === router.views.length - 1} />
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
    return <Navigate replace={process.env.PUBLIC_URL + '/home'}></Navigate>;
  } else {
    return <Navigate replace={process.env.PUBLIC_URL + '/login'}></Navigate>;
  }
}

export default function Router() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path={process.env.PUBLIC_URL + '/*'} element={<Adaptor />}></Route>
        <Route element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}