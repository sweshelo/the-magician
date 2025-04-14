import { useContext } from 'react';
import { WebSocketContext, WebSocketContextType } from '.';

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context == null) throw Error('useWebsocket must be used within a WebSocketProvider');
  return context;
};
