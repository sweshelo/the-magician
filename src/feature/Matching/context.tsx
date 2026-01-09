'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useWebSocket } from '@/hooks/websocket/hooks';
import { useErrorOverlay } from '@/hooks/error-overlay';
import type { Message } from '@/submodule/suit/types/message/message';
import type { Payload } from '@/submodule/suit/types/message/payload';
import type {
  MatchingStatusPayload,
  MatchFoundPayload,
} from '@/submodule/suit/types/message/payload/client';

// Type guards for payload types
function isMatchingStatusPayload(payload: Payload): payload is MatchingStatusPayload {
  return payload.type === 'MatchingStatus';
}

function isMatchFoundPayload(payload: Payload): payload is MatchFoundPayload {
  return payload.type === 'MatchFound';
}

export type MatchingMode = 'random' | 'rating' | 'rule';
export type MatchingStatus = 'idle' | 'selecting' | 'searching' | 'found' | 'cancelled' | 'error';

export interface MatchingState {
  queueId: string | null;
  status: MatchingStatus;
  mode: MatchingMode | null;
  queuePosition?: number;
  estimatedWaitTime?: number;
  matchedRoomId?: string;
  opponent?: {
    id: string;
    name: string;
    rating?: number;
  };
  error?: string;
}

interface MatchingContextValue extends MatchingState {
  setQueueId: (queueId: string | null) => void;
  setStatus: (status: MatchingStatus) => void;
  setMode: (mode: MatchingMode | null) => void;
  setMatchedRoomId: (roomId: string | undefined) => void;
  setOpponent: (opponent: MatchingState['opponent']) => void;
  setError: (error: string | undefined) => void;
  updateQueueInfo: (position?: number, waitTime?: number) => void;
}

const MatchingContext = createContext<MatchingContextValue | null>(null);

const initialState: MatchingState = {
  queueId: null,
  status: 'selecting',
  mode: null,
  queuePosition: undefined,
  estimatedWaitTime: undefined,
  matchedRoomId: undefined,
  opponent: undefined,
  error: undefined,
};

export function MatchingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MatchingState>(initialState);
  const { websocket } = useWebSocket();
  const { showError, showWarning } = useErrorOverlay();

  // State setters
  const setQueueId = (queueId: string | null) => {
    setState(prev => ({ ...prev, queueId }));
  };

  const setStatus = (status: MatchingStatus) => {
    setState(prev => ({ ...prev, status }));
  };

  const setMode = (mode: MatchingMode | null) => {
    setState(prev => ({ ...prev, mode }));
  };

  const setMatchedRoomId = (matchedRoomId: string | undefined) => {
    setState(prev => ({ ...prev, matchedRoomId }));
  };

  const setOpponent = (opponent: MatchingState['opponent']) => {
    setState(prev => ({ ...prev, opponent }));
  };

  const setError = (error: string | undefined) => {
    setState(prev => ({ ...prev, error }));
  };

  const updateQueueInfo = (queuePosition?: number, estimatedWaitTime?: number) => {
    setState(prev => ({
      ...prev,
      queuePosition,
      estimatedWaitTime,
    }));
  };

  // WebSocket message handlers
  useEffect(() => {
    if (!websocket) return;

    const handleMessage = (message: Message) => {
      const { action, payload } = message;

      switch (action.type) {
        case 'matchingStatus': {
          if (!isMatchingStatusPayload(payload)) {
            console.warn('Invalid MatchingStatusPayload received:', payload);
            break;
          }

          // Update queueId and status
          if (payload.queueId && !state.queueId) {
            setQueueId(payload.queueId);
          }

          if (payload.status === 'searching') {
            setStatus('searching');
          }

          // Update queue information
          updateQueueInfo(payload.queuePosition, payload.estimatedWaitTime);

          // Handle status updates
          if (payload.status === 'expired') {
            setStatus('error');
            setError('マッチングがタイムアウトしました');
            showWarning(
              '対戦相手が見つかりませんでした。\nもう一度お試しください。',
              'マッチングタイムアウト'
            );
          } else if (payload.status === 'cancelled') {
            setStatus('cancelled');
          }
          break;
        }

        case 'matchFound': {
          if (!isMatchFoundPayload(payload)) {
            console.warn('Invalid MatchFoundPayload received:', payload);
            break;
          }

          setStatus('found');
          setMatchedRoomId(payload.roomId);
          setOpponent(payload.opponent);
          break;
        }

        case 'error': {
          setStatus('error');
          setError('マッチング中にエラーが発生しました');
          showError('マッチング中にエラーが発生しました', 'エラー');
          break;
        }
      }
    };

    const handleDisconnect = () => {
      if (state.status === 'searching') {
        setStatus('error');
        setError('サーバーとの接続が切断されました');
        showError('サーバーとの接続が切断されました。\n再接続してください。', '接続エラー');
      }
    };

    websocket.on('message', handleMessage);
    websocket.on('close', handleDisconnect);

    return () => {
      websocket.off('message', handleMessage);
      websocket.off('close', handleDisconnect);
    };
  }, [websocket, state.status, showError, showWarning]);

  const contextValue: MatchingContextValue = {
    ...state,
    setQueueId,
    setStatus,
    setMode,
    setMatchedRoomId,
    setOpponent,
    setError,
    updateQueueInfo,
  };

  return <MatchingContext.Provider value={contextValue}>{children}</MatchingContext.Provider>;
}

export function useMatchingContext() {
  const context = useContext(MatchingContext);
  if (!context) {
    throw new Error('useMatchingContext must be used within MatchingProvider');
  }
  return context;
}
