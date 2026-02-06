'use client';

import { createContext, ReactNode, useReducer, useMemo, useCallback } from 'react';
import type { MatchingMode } from '@/submodule/suit/types/message/payload/server';

export type MatchingStatus = 'idle' | 'selecting' | 'waiting' | 'matched';

export interface MatchingState {
  status: MatchingStatus;
  mode: MatchingMode | null;
  queueId: string | null;
  position: number | null;
  roomId: string | null;
  opponentName: string | null;
  queueCounts: Record<MatchingMode, number>;
  activeGames: number;
}

export type MatchingAction =
  | { type: 'START_SELECTING' }
  | { type: 'QUEUE_JOINED'; queueId: string; position: number; mode: MatchingMode }
  | { type: 'MATCHING_SUCCESS'; roomId: string; opponentName: string }
  | { type: 'CANCEL' }
  | { type: 'RESET' }
  | { type: 'UPDATE_QUEUE_COUNTS'; queues: Record<MatchingMode, number> }
  | { type: 'UPDATE_ACTIVE_GAMES'; count: number };

export type MatchingContextType = {
  state: MatchingState;
  startSelecting: () => void;
  queueJoined: (queueId: string, position: number, mode: MatchingMode) => void;
  matchingSuccess: (roomId: string, opponentName: string) => void;
  cancel: () => void;
  reset: () => void;
  updateQueueCounts: (queues: Record<MatchingMode, number>) => void;
  updateActiveGames: (count: number) => void;
};

export const MatchingContext = createContext<MatchingContextType | undefined>(undefined);

const initialState: MatchingState = {
  status: 'idle',
  mode: null,
  queueId: null,
  position: null,
  roomId: null,
  opponentName: null,
  queueCounts: {
    freedom: 0,
    standard: 0,
    legacy: 0,
    limited: 0,
  },
  activeGames: 0,
};

function matchingReducer(state: MatchingState, action: MatchingAction): MatchingState {
  switch (action.type) {
    case 'START_SELECTING':
      return {
        ...initialState,
        status: 'selecting',
      };
    case 'QUEUE_JOINED':
      return {
        ...state,
        status: 'waiting',
        mode: action.mode,
        queueId: action.queueId,
        position: action.position,
      };
    case 'MATCHING_SUCCESS':
      return {
        ...state,
        status: 'matched',
        roomId: action.roomId,
        opponentName: action.opponentName,
      };
    case 'CANCEL':
      return {
        ...initialState,
        status: 'idle',
      };
    case 'RESET':
      return initialState;
    case 'UPDATE_QUEUE_COUNTS':
      return { ...state, queueCounts: action.queues };
    case 'UPDATE_ACTIVE_GAMES':
      return { ...state, activeGames: action.count };
    default:
      return state;
  }
}

export const MatchingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(matchingReducer, initialState);

  const startSelecting = useCallback(() => {
    dispatch({ type: 'START_SELECTING' });
  }, []);

  const queueJoined = useCallback((queueId: string, position: number, mode: MatchingMode) => {
    dispatch({ type: 'QUEUE_JOINED', queueId, position, mode });
  }, []);

  const matchingSuccess = useCallback((roomId: string, opponentName: string) => {
    dispatch({ type: 'MATCHING_SUCCESS', roomId, opponentName });
  }, []);

  const cancel = useCallback(() => {
    dispatch({ type: 'CANCEL' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const updateQueueCounts = useCallback((queues: Record<MatchingMode, number>) => {
    dispatch({ type: 'UPDATE_QUEUE_COUNTS', queues });
  }, []);

  const updateActiveGames = useCallback((count: number) => {
    dispatch({ type: 'UPDATE_ACTIVE_GAMES', count });
  }, []);

  const contextValue = useMemo(
    () => ({
      state,
      startSelecting,
      queueJoined,
      matchingSuccess,
      cancel,
      reset,
      updateQueueCounts,
      updateActiveGames,
    }),
    [state, startSelecting, queueJoined, matchingSuccess, cancel, reset, updateQueueCounts]
  );

  return <MatchingContext.Provider value={contextValue}>{children}</MatchingContext.Provider>;
};
