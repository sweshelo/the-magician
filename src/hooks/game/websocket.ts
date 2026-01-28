'use client';

import { useCallback } from 'react';
import { useWebSocket } from '../websocket/hooks';
import {
  ContinuePayload,
  createMessage,
  EvolveDrivePayload,
  ICard,
  IUnit,
  JokerDrivePayload,
  Message,
  OverridePayload,
  UnitDrivePayload,
} from '@/submodule/suit/types';
import { useSelfId } from '@/hooks/player-identity';
import { useTimer } from '@/feature/Timer/hooks';

export const useWebSocketGame = () => {
  const { websocket } = useWebSocket();
  const { totalSeconds } = useTimer();
  const selfId = useSelfId();

  const send = useCallback(
    (message: Message) => {
      if (websocket) {
        websocket?.send(message);
      } else {
        console.error('WebSocket接続確立前に send が呼び出されました。');
      }
    },
    [websocket]
  );

  interface OverrideProps {
    target: string;
    parent: string;
  }
  const override = useCallback(
    ({ target, parent }: OverrideProps) => {
      const message: Message<OverridePayload> = {
        action: {
          type: 'game',
          handler: 'core',
        },
        payload: {
          type: 'Override',
          parent: { id: parent },
          target: { id: target },
          player: selfId,
        },
      };
      send(message);
    },
    [send, selfId]
  );

  interface UnitDriveProps {
    target: string;
  }
  const unitDrive = useCallback(
    ({ target }: UnitDriveProps) => {
      const message: Message<UnitDrivePayload> = {
        action: {
          type: 'game',
          handler: 'core',
        },
        payload: {
          type: 'UnitDrive',
          target: { id: target },
          player: selfId,
          remainingTime: totalSeconds,
        },
      };
      send(message);
    },
    [send, totalSeconds, selfId]
  );

  interface JokerDriveProps {
    target: string;
  }
  const jokerDrive = useCallback(
    ({ target }: JokerDriveProps) => {
      const message: Message<JokerDrivePayload> = {
        action: {
          type: 'game',
          handler: 'core',
        },
        payload: {
          type: 'JokerDrive',
          target: { id: target },
          player: selfId,
          remainingTime: totalSeconds,
        },
      };
      send(message);
    },
    [send, totalSeconds, selfId]
  );

  interface ContinueProps {
    promptId: string;
  }
  const continueGame = useCallback(
    ({ promptId }: ContinueProps) => {
      const message: Message<ContinuePayload> = {
        action: {
          type: 'game',
          handler: 'core',
        },
        payload: {
          type: 'Continue',
          promptId,
          player: selfId,
        },
      };
      send(message);
    },
    [send, selfId]
  );

  const choose = useCallback(
    ({ promptId, choice }: { promptId: string; choice: string[] | undefined }) => {
      const message: Message = {
        action: {
          type: 'game',
          handler: 'core',
        },
        payload: {
          type: 'Choose',
          promptId,
          choice,
        },
      };
      send(message);
    },
    [send]
  );

  interface WithdrawalProps {
    target: IUnit;
  }
  const withdrawal = useCallback(
    ({ target }: WithdrawalProps) => {
      const message: Message = createMessage({
        action: {
          type: 'game',
          handler: 'core',
        },
        payload: {
          type: 'Withdrawal',
          target,
          player: selfId,
        },
      });
      send(message);
    },
    [send, selfId]
  );

  interface BootProps {
    target: IUnit;
  }
  const boot = useCallback(
    ({ target }: BootProps) => {
      const message: Message = createMessage({
        action: {
          type: 'game',
          handler: 'core',
        },
        payload: {
          type: 'Boot',
          target,
          player: selfId,
          remainingTime: totalSeconds,
        },
      });
      send(message);
    },
    [send, totalSeconds, selfId]
  );

  interface SetTriggerProps {
    target: ICard;
  }
  const setTrigger = useCallback(
    ({ target }: SetTriggerProps) => {
      const message: Message = createMessage({
        action: {
          type: 'game',
          handler: 'core',
        },
        payload: {
          type: 'TriggerSet',
          target,
          player: selfId,
        },
      });
      send(message);
    },
    [send, selfId]
  );

  interface DiscardProps {
    target: ICard;
  }
  const discard = useCallback(
    ({ target }: DiscardProps) => {
      const message: Message = createMessage({
        action: {
          type: 'game',
          handler: 'core',
        },
        payload: {
          type: 'Discard',
          target,
          player: selfId,
        },
      });
      send(message);
    },
    [send, selfId]
  );

  interface EvolutionProps {
    source: IUnit; // 進化元（フィールド上のユニット）
    target: ICard; // 進化先（手札のカード）
  }
  const evolution = useCallback(
    ({ source, target }: EvolutionProps) => {
      const message: Message<EvolveDrivePayload> = createMessage({
        action: {
          type: 'game',
          handler: 'core',
        },
        payload: {
          type: 'EvolveDrive',
          target: { id: target.id },
          source: { id: source.id },
          player: selfId,
          remainingTime: totalSeconds,
        },
      });
      send(message);
    },
    [send, totalSeconds, selfId]
  );

  return {
    send,
    override,
    unitDrive,
    jokerDrive,
    continueGame,
    choose,
    withdrawal,
    setTrigger,
    discard,
    evolution,
    boot,
  };
};
