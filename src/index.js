import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useLocation } from 'react-router'
import './index.css';
import App from './App';
import StoreContext from './contexts/store';
import RouterContext, { router } from './contexts/router.js';
import store from './store'

function Context({ children }) {
  return (
    <StoreContext.Provider value={store}>
      <RouterContext.Provider value={router}>
        {children}
      </RouterContext.Provider>
    </StoreContext.Provider>
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
