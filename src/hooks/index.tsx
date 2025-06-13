import { ReactNode } from 'react';
import { WebSocketProvider } from './websocket';
import { SystemContextProvider } from './system';
import { AttackAnimationProvider } from './attack-animation';
import { SoundManagerV2Provider } from './soundV2';

interface Props {
  children: ReactNode;
}

export const GlobalContextProvider = ({ children }: Props) => {
  return (
    <WebSocketProvider>
      <SystemContextProvider>
        <AttackAnimationProvider>
          <SoundManagerV2Provider>{children}</SoundManagerV2Provider>
        </AttackAnimationProvider>
      </SystemContextProvider>
    </WebSocketProvider>
  );
};
