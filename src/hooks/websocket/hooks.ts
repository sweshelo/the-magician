import { useContext } from 'react'
import { WebSocketContext } from '.'

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (context == null) throw Error('useWebsocket must be used within a WebSocketProvider')
  return context
}
