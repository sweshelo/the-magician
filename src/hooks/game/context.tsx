'use client';

import { createContext, ReactNode, useReducer, useMemo } from "react";
import { GameAction, gameReducer, GameState } from "./reducer";

// Context用の型定義：stateとdispatchを公開
export type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

export const GameContext = createContext<GameContextType | undefined>(undefined);

// 初期状態
const initialState: GameState = {
  players: undefined,
  turn: 0,
  round: 0,
  selectedCard: undefined,
};

// Providerコンポーネント：useReducerを利用して状態管理を行い、Contextに値を渡します
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // valueの再生成を防ぐためuseMemoを利用
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <GameContext.Provider value= { contextValue } >
    { children }
    </GameContext.Provider>
  );
};
