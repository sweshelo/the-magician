import { IPlayer, Rule } from "@/submodule/suit/types";

// ステートの型定義
export interface GameState {
  players?: {
    [key: string]: IPlayer
  };
  game: {
    turn: number;
    round: number;
  };
  rule: Rule;
};

// アクションの型定義
export type GameAction =
  | { type: 'SET_PLAYER'; player: IPlayer }
  | { type: 'SET_TURN'; turn: number }
  | { type: 'SET_ROUND'; round: number }
  | { type: 'SET_ALL'; game: GameState };

// Reducer関数
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER':
      return {
        ...state,
        players: {
          ...state.players,
          [action.player.id]: action.player
        }
      }
    case 'SET_TURN':
      return { ...state, game: { ...state.game, turn: action.turn } }
    case 'SET_ROUND':
      return { ...state, game: { ...state.game, round: action.round } };
    case 'SET_ALL':
      return { ...action.game }
    default:
      return state
  }
}
