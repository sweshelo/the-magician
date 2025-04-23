import { ReactNode } from 'react';
import { WebSocketProvider } from './websocket';
import { SystemContextProvider } from './system';
import { AttackAnimationProvider } from './attack-animation';

interface Props {
  children: ReactNode;
}

export const GlobalContextProvider = ({ children }: Props) => {
  return (
    <WebSocketProvider>
      <SystemContextProvider>
        <AttackAnimationProvider>{children}</AttackAnimationProvider>
      </SystemContextProvider>
    </WebSocketProvider>
  );
};
