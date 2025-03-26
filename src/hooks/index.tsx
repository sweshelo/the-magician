import { ReactNode } from "react"
import { WebSocketProvider } from "./websocket"
import { SystemContextProvider } from "./system"
import { GameProvider } from "./game"

interface Props {
  children: ReactNode
}

export const GlobalContextProvider = ({ children }: Props) => {
  return (
    <WebSocketProvider>
      <SystemContextProvider>
        <GameProvider>
          {children}
        </GameProvider>
      </SystemContextProvider>
    </WebSocketProvider>
  )
}