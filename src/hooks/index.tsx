import { ReactNode } from 'react';
import { WebSocketProvider } from './websocket';
import { SystemContextProvider } from './system';
import { CardsDialogProvider } from './cards-dialog';
import { CardEffectDialogProvider } from './card-effect-dialog';
import { InterceptUsageProvider } from './intercept-usage';
import { CardUsageEffectProvider } from './card-usage-effect';
import { SoundManagerV2Provider } from './soundV2';
import { TimerProvider } from '@/feature/Timer/context';

interface Props {
  children: ReactNode;
}

export const GlobalContextProvider = ({ children }: Props) => {
  return (
    <WebSocketProvider>
      <SystemContextProvider>
        <SoundManagerV2Provider>
          <CardsDialogProvider>
            <CardEffectDialogProvider>
              <CardUsageEffectProvider>
                <InterceptUsageProvider>
                  <TimerProvider>{children}</TimerProvider>
                </InterceptUsageProvider>
              </CardUsageEffectProvider>
            </CardEffectDialogProvider>
          </CardsDialogProvider>
        </SoundManagerV2Provider>
      </SystemContextProvider>
    </WebSocketProvider>
  );
};
