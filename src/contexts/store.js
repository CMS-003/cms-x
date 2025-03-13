import React, { useContext } from 'react';

export const StoreContext = React.createContext(null);

export function useStore() {
  return useContext(Context);
}
