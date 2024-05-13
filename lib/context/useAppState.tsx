import { AppContext } from '.'
import { useContext } from 'react'

export const useAppState = () => {
  const appState = useContext(AppContext)
  return appState
}

