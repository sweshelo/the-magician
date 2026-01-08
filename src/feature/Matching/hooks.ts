'use client';

import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { useWebSocket } from '@/hooks/websocket/hooks';
import { useMatchingContext, type MatchingMode } from './context';
import { LocalStorageHelper } from '@/service/local-storage';
import type {
  MatchingStartRequestPayload,
  MatchingCancelRequestPayload,
} from '@/submodule/suit/types/message/payload/server';
import type { Message } from '@/submodule/suit/types/message/message';

export function useMatching() {
  const context = useMatchingContext();
  const { websocket } = useWebSocket();
  const router = useRouter();

  const startMatching = async (mode: MatchingMode) => {
    try {
      // 1. Deck validation
      const mainDeck = LocalStorageHelper.getMainDeck();
      if (!mainDeck || mainDeck.cards.length !== 40) {
        throw new Error(
          '有効なデッキが設定されていません。デッキは40枚のカードで構成されている必要があります。'
        );
      }

      // 2. Set mode and initial status
      context.setMode(mode);

      // 3. Send WebSocket request - サーバーはMatchingStatusPayloadで応答
      // Note: request()はエラーレスポンスをrejectするので、try-catchで捕捉できる
      await websocket?.request<MatchingStartRequestPayload>({
        action: { handler: 'server', type: 'matchingStart' },
        payload: {
          type: 'MatchingStartRequest',
          requestId: nanoid(),
          userId: LocalStorageHelper.playerId(),
          mode,
          criteria: {
            deck: mainDeck.cards,
            jokersOwned: mainDeck.jokers || [],
            // rating: ... (for rating mode)
            // rulePreference: ... (for rule mode)
          },
        },
      } satisfies Message<MatchingStartRequestPayload>);

      // 4. サーバーからの成功レスポンスを受信後、WebSocketの'message'イベントで
      //    MatchingStatusPayloadが送られてくる。これはcontext.tsxで処理される。
      console.log(`Started ${mode} matching`);
    } catch (error) {
      // WebSocketのrequest()がrejectした場合（サーバーエラー）
      context.setStatus('error');
      context.setError(error instanceof Error ? error.message : 'マッチングの開始に失敗しました');
      throw error;
    }
  };

  const cancelMatching = async () => {
    try {
      if (!context.queueId) {
        console.warn('No active queue to cancel');
        return;
      }

      await websocket?.request<MatchingCancelRequestPayload>({
        action: { handler: 'server', type: 'matchingCancel' },
        payload: {
          type: 'MatchingCancelRequest',
          requestId: nanoid(),
          userId: LocalStorageHelper.playerId(),
          queueId: context.queueId,
        },
      } satisfies Message<MatchingCancelRequestPayload>);

      context.setStatus('cancelled');
      console.log('Matching cancelled');

      // Navigate back to entrance after a short delay
      setTimeout(() => {
        context.setStatus('idle');
        router.push('/entrance');
      }, 1000);
    } catch (error) {
      console.error('Failed to cancel matching:', error);
      context.setError('マッチングのキャンセルに失敗しました');
      throw error;
    }
  };

  return {
    ...context,
    startMatching,
    cancelMatching,
  };
}
