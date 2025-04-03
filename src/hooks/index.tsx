import { ReactNode } from "react"
import { WebSocketProvider } from "./websocket"
import { SystemContextProvider } from "./system"
import { GameProvider } from "./game"
import { CardsDialogProvider } from "./cards-dialog"
import { SoundManagerProvider } from "./sound/context"
import { CardEffectDialogProvider } from "./card-effect-dialog"

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
              <CardEffectDialogProvider>
                {children}
              </CardEffectDialogProvider>
            </CardsDialogProvider>
          </SoundManagerProvider>
        </GameProvider>
      </SystemContextProvider>
    </WebSocketProvider>
  )
}
