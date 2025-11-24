import { useContext } from 'react'
import RouterContext from './router'
import StoreContext from './store'
import QueryContext from './query'

export function useRouter() {
  return useContext(RouterContext)
}

export function useStore() {
  return useContext(StoreContext)
}

export function useQuery() {
  return useContext(QueryContext)
}

