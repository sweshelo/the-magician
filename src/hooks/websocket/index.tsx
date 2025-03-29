'use client';

import { webSocketService } from "@/service/websocket";
import { createContext, ReactNode, useEffect, useState } from "react";

export type WebSocketContextType = {
  websocket: typeof webSocketService | undefined;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [websocket, setWebsocket] = useState<typeof webSocketService | undefined>(undefined);

  useEffect(() => setWebsocket(webSocketService), []);

  return (
    <WebSocketContext.Provider value={{ websocket }}>
      {children}
    </WebSocketContext.Provider>
  )
}