import { useCallback, useEffect } from 'react';
import { useWebSocket } from '@/hooks/websocket/hooks';
import { useMatching } from '@/hooks/matching';
import { useSelfId } from '@/hooks/player-identity';
import { useDeck } from '@/hooks/deck';
import { LocalStorageHelper } from '@/service/local-storage';
import type { Message } from '@/submodule/suit/types';
import type {
  MatchingMode,
  MatchingStartRequestPayload,
  MatchingStartResponsePayload,
  MatchingCancelRequestPayload,
  MatchingCancelResponsePayload,
} from '@/submodule/suit/types/message/payload/server';
import type { MatchingSuccessPayload } from '@/submodule/suit/types/message/payload/client';

interface UseMatchingRequestReturn {
  startMatching: (mode: MatchingMode) => Promise<void>;
  cancelMatching: () => Promise<void>;
}

export const useMatchingRequest = (): UseMatchingRequestReturn => {
  const { websocket } = useWebSocket();
  const { queueJoined, matchingSuccess, cancel } = useMatching();
  const selfId = useSelfId();
  const { mainDeck } = useDeck();

  // Listen for MatchingSuccess messages
  useEffect(() => {
    if (!websocket) return;

    const handleMessage = (message: Message) => {
      // MatchingSuccessPayload may not be in Payload union yet, so use type assertion
      const payload = message.payload as { type: string } & Partial<MatchingSuccessPayload>;
      if (payload.type === 'MatchingSuccess' && payload.roomId && payload.opponentName) {
        matchingSuccess(payload.roomId, payload.opponentName);
      }
    };

    websocket.on('message', handleMessage);

    return () => {
      websocket.off('message', handleMessage);
    };
  }, [websocket, matchingSuccess]);

  const startMatching = useCallback(
    async (mode: MatchingMode) => {
      if (!websocket) {
        throw new Error('WebSocket is not connected');
      }

      // Get player info
      const playerName = LocalStorageHelper.playerName();
      const playerId = LocalStorageHelper.playerId();

      if (!mainDeck) {
        throw new Error('メインデッキが設定されていません');
      }

      const response = await websocket.request<
        MatchingStartRequestPayload,
        MatchingStartResponsePayload
      >({
        action: {
          handler: 'server',
          type: 'matching-start',
        },
        payload: {
          type: 'MatchingStartRequest',
          requestId: selfId,
          mode,
          player: {
            name: playerName,
            id: playerId,
            deck: mainDeck.cards,
          },
          jokersOwned: mainDeck.jokers,
        },
      } satisfies Message<MatchingStartRequestPayload>);

      queueJoined(response.payload.queueId, response.payload.position, mode);
    },
    [websocket, selfId, queueJoined, mainDeck]
  );

  const cancelMatching = useCallback(async () => {
    if (!websocket) {
      throw new Error('WebSocket is not connected');
    }

    await websocket.request<MatchingCancelRequestPayload, MatchingCancelResponsePayload>({
      action: {
        handler: 'server',
        type: 'matching-cancel',
      },
      payload: {
        type: 'MatchingCancelRequest',
        requestId: selfId,
      },
    } satisfies Message<MatchingCancelRequestPayload>);

    cancel();
  }, [websocket, selfId, cancel]);

  return { startMatching, cancelMatching };
};
