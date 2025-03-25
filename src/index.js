import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useLocation } from 'react-router'
import './index.css';
import App from './App';
import StoreContext from './contexts/store';
import RouterContext from './contexts/router.js';
import store from './store'

function Context({ children }) {
  const location = useLocation()
  return (
    <StoreContext.Provider value={store}>
      <RouterContext value={location}>
        {children}
      </RouterContext>
    </StoreContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
