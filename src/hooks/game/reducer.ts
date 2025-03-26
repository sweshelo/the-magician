import { Card } from "@/type/game/Card";
import { Player } from "@/type/game/Player";

// ステートの型定義
export type GameState = {
  players?: {
    [key: string]: Player
  };
  turn: number;
  round: number;
  selectedCard?: Card;
};

// アクションの型定義
export type GameAction =
  | { type: 'SET_PLAYER'; player: Player }
  | { type: 'SET_TURN'; turn: number }
  | { type: 'SET_ROUND'; round: number }
  | { type: 'SET_SELECTED_CARD'; card?: Card };

// Reducer関数
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER':
      return {
        ...state, players: {
          ...state.players,
          [action.player.id]: action.player
        }
      };
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