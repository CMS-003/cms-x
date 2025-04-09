import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StoreContext from './contexts/store';
import { Observer } from 'mobx-react-lite';
import RouterContext, { router, View, getViews } from './contexts/router.js';
import store from './store'
import { useEffectOnce } from 'react-use';

function Context({ children }) {
  const [routes, setRoutes] = useState({ views: [] })
  useEffectOnce(() => {
    const views = getViews(window.location);
    setRoutes((View.create({ views })))
  })
  return (
    <Observer>{() => (
      <StoreContext.Provider value={store}>
        <RouterContext.Provider value={routes}>
          {children}
        </RouterContext.Provider>
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
