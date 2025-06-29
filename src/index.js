import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StoreContext from './contexts/store';
import { Observer } from 'mobx-react-lite';
import RouterContext, { getViews } from './contexts/router.js';
import store from './store'
import { isPWA, isPWAorMobile } from './utils';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`/${APP}/service-worker.js`)
      .then(registration => {
        console.log('✅ SW registered:', registration);
      })
      .catch(error => {
        console.error('❌ SW registration failed:', error);
      });
  });
}

function Context({ children }) {
  const router = useContext(RouterContext);
  const [inited, setInited] = useState(false)
  useEffect(() => {
    if (!window.location.pathname.startsWith(process.env.PUBLIC_URL)) {
      window.history.pushState(null, '', process.env.PUBLIC_URL)
    }
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
