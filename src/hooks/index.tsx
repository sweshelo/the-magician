import { ReactNode } from "react"
import { WebSocketProvider } from "./websocket"
import { SystemContextProvider } from "./system"
import { GameProvider } from "./game"
import { CardsDialogProvider } from "./cards-dialog"
import { SoundManagerProvider } from "./sound/context"
import { CardEffectDialogProvider } from "./card-effect-dialog"
import { InterceptUsageProvider } from "./intercept-usage"
import { CardUsageEffectProvider } from "./card-usage-effect"

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
                <CardUsageEffectProvider>
                  <InterceptUsageProvider>
                    {children}
                  </InterceptUsageProvider>
                </CardUsageEffectProvider>
              </CardEffectDialogProvider>
            </CardsDialogProvider>
          </SoundManagerProvider>
        </GameProvider>
      </SystemContextProvider>
    </WebSocketProvider>
  )
}
