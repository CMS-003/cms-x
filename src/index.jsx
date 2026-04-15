import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StoreContext from './contexts/store';
import { Observer } from 'mobx-react-lite';
import RouterContext, { getViews } from './contexts/router.jsx';
import store from './store'
import { isPWA, isPWAorMobile } from './utils';
import { registerSW } from 'virtual:pwa-register';

// 注册 Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    // 有新内容可用时，显示提示（可选）
    if (confirm('新版本可用，是否刷新？')) {
      updateSW(true);  // 用户确认后更新
    }
  },
  onOfflineReady() {
    console.log('应用已准备好离线使用');
  },
  onRegistered(registration) {
    console.log('Service Worker 已注册', registration);
  },
  onRegisterError(error) {
    console.error('Service Worker 注册失败', error);
  },
});

function Context({ children }) {
  const router = useContext(RouterContext);
  const [inited, setInited] = useState(false)
  useEffect(() => {
    if (!inited) {
      const views = getViews(window.location);
      setInited(true)
      router.setViews(views);
    }
  }, [window.location.pathname])
  return (
    <Observer>{() => (
      <StoreContext.Provider value={store}>
        {children}
      </StoreContext.Provider>
    )}</Observer>
  )
}

let extraClass = '';
if (isPWA()) {
  extraClass = 'is-pwa'
} else if (isPWAorMobile()) {
  extraClass = 'is-mobile'
}
if (extraClass) {
  document.getElementById('root').classList.add(extraClass)
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <Context>
      <App />
    </Context>
  </React.Fragment>
);
