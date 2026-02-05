import { ReactNode } from 'react';
import { WebSocketProvider } from './websocket';
import { SystemContextProvider } from './system';
import { ErrorOverlayProvider } from './error-overlay';
import { PlayerIdentityProvider } from './player-identity';
import { MatchingProvider } from './matching';

interface Props {
  children: ReactNode;
}

export const GlobalContextProvider = ({ children }: Props) => {
  return (
    <ErrorOverlayProvider>
      <WebSocketProvider>
        <PlayerIdentityProvider>
          <SystemContextProvider>
            <MatchingProvider>{children}</MatchingProvider>
          </SystemContextProvider>
        </PlayerIdentityProvider>
      </WebSocketProvider>
    </ErrorOverlayProvider>
  );
};
