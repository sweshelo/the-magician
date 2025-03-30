import { ReactNode } from "react"
import { WebSocketProvider } from "./websocket"
import { SystemContextProvider } from "./system"
import { GameProvider } from "./game"
import { CardsDialogProvider } from "./cards-dialog"

interface Props {
  children: ReactNode
}

export const GlobalContextProvider = ({ children }: Props) => {
  return (
    <WebSocketProvider>
      <SystemContextProvider>
        <GameProvider>
          <CardsDialogProvider>
            {children}
          </CardsDialogProvider>
        </GameProvider>
      </SystemContextProvider>
    </WebSocketProvider>
  )
}
