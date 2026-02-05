'use client';

import { useEffect, useCallback } from 'react';
import { useWebSocket } from '@/hooks/websocket/hooks';
import { useMatching } from './hooks';
import type { Message, MatchingStatusRequestPayload } from '@/submodule/suit/types';
import type { MatchingStatusPayload } from '@/submodule/suit/types/message/payload/client';

export const useQueueStatus = () => {
  const { websocket } = useWebSocket();
  const { updateQueueCounts } = useMatching();

  // マッチング状況をサーバーにリクエスト
  const requestQueueStatus = useCallback(() => {
    if (!websocket) return;

    const message: Message<MatchingStatusRequestPayload> = {
      action: {
        handler: 'server',
        type: 'matchingStatus',
      },
      payload: {
        type: 'MatchingStatusRequest',
      },
    };

    websocket.send(message);
  }, [websocket]);

  // MatchingStatusメッセージをリッスン
  useEffect(() => {
    if (!websocket) return;

    const handleMessage = (message: Message) => {
      const payload = message.payload as { type: string };
      if (payload.type === 'MatchingStatus') {
        const statusPayload = payload as MatchingStatusPayload;
        updateQueueCounts(statusPayload.queues);
      }
    };

    websocket.on('message', handleMessage);
    return () => {
      websocket.off('message', handleMessage);
    };
  }, [websocket, updateQueueCounts]);

  return { requestQueueStatus };
};
