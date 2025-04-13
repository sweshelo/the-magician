import { ReactNode } from 'react';
import { WebSocketProvider } from './websocket';
import { SystemContextProvider } from './system';
import { GameProvider } from './game';
import { CardsDialogProvider } from './cards-dialog';
import { CardEffectDialogProvider } from './card-effect-dialog';
import { InterceptUsageProvider } from './intercept-usage';
import { CardUsageEffectProvider } from './card-usage-effect';
import { SoundManagerV2Provider } from './soundV2';

interface Props {
  children: ReactNode;
}

export const GlobalContextProvider = ({ children }: Props) => {
  return (
    <WebSocketProvider>
      <SystemContextProvider>
        <GameProvider>
          <SoundManagerV2Provider>
            <CardsDialogProvider>
              <CardEffectDialogProvider>
                <CardUsageEffectProvider>
                  <InterceptUsageProvider>{children}</InterceptUsageProvider>
                </CardUsageEffectProvider>
              </CardEffectDialogProvider>
            </CardsDialogProvider>
          </SoundManagerV2Provider>
        </GameProvider>
      </SystemContextProvider>
    </WebSocketProvider>
  );
};
