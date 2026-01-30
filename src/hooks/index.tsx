import { ReactNode } from 'react';
import { WebSocketProvider } from './websocket';
import { SystemContextProvider } from './system';
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
          <SystemContextProvider>{children}</SystemContextProvider>
        </PlayerIdentityProvider>
      </WebSocketProvider>
    </ErrorOverlayProvider>
  );
};
