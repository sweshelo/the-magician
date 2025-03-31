import { ReactNode } from "react"
import { WebSocketProvider } from "./websocket"
import { SystemContextProvider } from "./system"
import { GameProvider } from "./game"
import { CardsDialogProvider } from "./cards-dialog"
import { SoundManagerProvider } from "./sound/context"

interface Props {
  children: ReactNode
}

export const GlobalContextProvider = ({ children }: Props) => {
  return (
    <WebSocketProvider>
      <SystemContextProvider>
        <GameProvider>
          <SoundManagerProvider>
            <CardsDialogProvider>
              {children}
            </CardsDialogProvider>
          </SoundManagerProvider>
        </GameProvider>
      </SystemContextProvider>
    </WebSocketProvider>
  )
}
