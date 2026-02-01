'use client';

import {
  createContext,
  ReactNode,
  useReducer,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';

export type GameResultReason = 'damage' | 'limit' | 'surrender';
export type GameResultType = 'win' | 'lose';

export interface GameResultState {
  isVisible: boolean;
  reason: GameResultReason;
  result: GameResultType;
  showExitButton: boolean;
}

export interface GameResultParams {
  winner?: string;
  reason: GameResultReason;
}

export type GameResultAction =
  | { type: 'SHOW_RESULT'; reason: GameResultReason; result: GameResultType }
  | { type: 'SHOW_EXIT_BUTTON' }
  | { type: 'HIDE_RESULT' };

export type GameResultContextType = {
  state: GameResultState;
  showGameResult: (params: GameResultParams, selfId: string) => void;
  hideGameResult: () => void;
};

export const GameResultContext = createContext<GameResultContextType | undefined>(undefined);

const initialState: GameResultState = {
  isVisible: false,
  reason: 'damage',
  result: 'lose',
  showExitButton: false,
};

function gameResultReducer(state: GameResultState, action: GameResultAction): GameResultState {
  switch (action.type) {
    case 'SHOW_RESULT':
      return {
        ...state,
        isVisible: true,
        reason: action.reason,
        result: action.result,
        showExitButton: false,
      };
    case 'SHOW_EXIT_BUTTON':
      return {
        ...state,
        showExitButton: true,
      };
    case 'HIDE_RESULT':
      return {
        ...state,
        isVisible: false,
        showExitButton: false,
      };
    default:
      return state;
  }
}

export const GameResultProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameResultReducer, initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showGameResult = useCallback(
    (params: GameResultParams, selfId: string): void => {
      const result: GameResultType = params.winner === selfId ? 'win' : 'lose';

      dispatch({ type: 'SHOW_RESULT', reason: params.reason, result });

      // 3秒後に退室ボタンを表示
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: 'SHOW_EXIT_BUTTON' });
      }, 3000);
    },
    [dispatch]
  );

  const hideGameResult = useCallback((): void => {
    dispatch({ type: 'HIDE_RESULT' });
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const contextValue = useMemo(
    () => ({ state, showGameResult, hideGameResult }),
    [state, showGameResult, hideGameResult]
  );

  return <GameResultContext.Provider value={contextValue}>{children}</GameResultContext.Provider>;
};
