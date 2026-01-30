import { ReactNode } from 'react';
import { WebSocketProvider } from './websocket';
import { SystemContextProvider } from './system';
import { AttackAnimationProvider } from './attack-animation';
import { SoundManagerV2Provider } from './soundV2';
import { ErrorOverlayProvider } from './error-overlay';
import { PlayerIdentityProvider } from './player-identity';

interface Props {
  children: ReactNode;
}

export const GlobalContextProvider = ({ children }: Props) => {
  return (
    <ErrorOverlayProvider>
      <WebSocketProvider>
        <PlayerIdentityProvider>
          <SystemContextProvider>
            <AttackAnimationProvider>
              <SoundManagerV2Provider>{children}</SoundManagerV2Provider>
            </AttackAnimationProvider>
          </SystemContextProvider>
        </PlayerIdentityProvider>
      </WebSocketProvider>
    </ErrorOverlayProvider>
  );
};
