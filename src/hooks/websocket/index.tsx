'use client';

import { webSocketService } from "@/service/websocket";
import { createContext, ReactNode, useState } from "react";

type WebSocketContextType = {
  websocket: typeof webSocketService;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [websocket] = useState(webSocketService);

  return (
    <WebSocketContext.Provider value={{ websocket }}>
      {children}
    </WebSocketContext.Provider>
  )
}