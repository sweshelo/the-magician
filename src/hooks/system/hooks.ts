import { useContext } from 'react'
import { SystemContext } from '.'

export const useSystemContext = () => {
  const context = useContext(SystemContext)
  if (context == null) throw Error('useSystemContext must be used within a SystemProvider')
  return context
}
