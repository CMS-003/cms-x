import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StoreContext from './contexts/store';
import { Observer } from 'mobx-react-lite';
import RouterContext, { router, View, getViews } from './contexts/router.js';
import store from './store'
import SafeArea from './components/SafeArea/index.js';

function Context({ children }) {
  const router = useContext(RouterContext);
  const [inited, setInited] = useState(false)
  useEffect(() => {
    if (!/^\/demo/.test(window.location.pathname)) {
      window.history.pushState(null, '', '/demo')
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
        <SafeArea>
          {children}
        </SafeArea>
      </StoreContext.Provider>
    )}</Observer>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <Context>
      <App />
    </Context>
  </React.Fragment>
);
