"use client";

import { Card } from "@/type/game/Card";
import { Player } from "@/type/game/Player";
import { createContext, ReactNode, useReducer, useMemo } from "react";

/**
 * 細かいステート更新のために、useReducerを利用して状態管理を行います。
 * この実装では、現状のplayers, turn, round, selectedCardを管理していますが、
 * 今後必要に応じてデータの正規化やより複雑なカード移動のロジックを実装する際に拡張できます。
 */
 
// ステートの型定義（正規化が必要な場合は、後々playersを辞書形式へ変更するなどの対処が可能）
export type GameState = {
  players?: Player[];
  turn: number;
  round: number;
  selectedCard?: Card;
};

// 初期状態
const initialState: GameState = {
  players: undefined,
  turn: 0,
  round: 0,
  selectedCard: undefined,
};

// アクションの型定義
export type GameAction = 
  | { type: 'SET_PLAYERS'; players: Player[] }
  | { type: 'SET_TURN'; turn: number }
  | { type: 'SET_ROUND'; round: number }
  | { type: 'SET_SELECTED_CARD'; card?: Card };

// Reducer関数
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYERS':
      return { ...state, players: action.players };
    case 'SET_TURN':
      return { ...state, turn: action.turn };
    case 'SET_ROUND':
      return { ...state, round: action.round };
    case 'SET_SELECTED_CARD':
      return { ...state, selectedCard: action.card };
    default:
      return state;
  }
}

// Context用の型定義：stateとdispatchを公開
export type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

export const GameContext = createContext<GameContextType | undefined>(undefined);

// Providerコンポーネント：useReducerを利用して状態管理を行い、Contextに値を渡します
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // valueの再生成を防ぐためuseMemoを利用
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};
