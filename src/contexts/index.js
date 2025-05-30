import { useContext } from 'react'
import RouterContext from './router'
import StoreContext from './store'

export function useRouter() {
  return useContext(RouterContext)
}

export function useStore() {
  return useContext(StoreContext)
}