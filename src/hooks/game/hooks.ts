import { useContext } from "react"

import { Player } from "@/type/game/Player";
import { Card } from "@/type/game/Card";
import { GameContext } from "./context";

const useGameContext = () => {
  const context = useContext(GameContext)
  if (!context) throw Error('useGameContext must be used within a GameProvider')
  return context;
}

/**
 * カスタムフックとしてGameContextのstateと、dispatchをラップしたヘルパー関数を提供します。
 * 以前のsetTurnやsetRoundなどのAPIに合わせ、dispatchを利用した更新関数を実装しています。
 */
export const useGame = () => {
  const { state, dispatch } = useGameContext();

  const setTurn = (turn: number) => dispatch({ type: 'SET_TURN', turn });
  const setRound = (round: number) => dispatch({ type: 'SET_ROUND', round });
  const setPlayer = (player: Player) => dispatch({ type: 'SET_PLAYER', player });
  const setSelectedCard = (card: Card) => dispatch({ type: 'SET_SELECTED_CARD', card });

  return {
    ...state,
    setTurn,
    setRound,
    setPlayer,
    setSelectedCard,
    dispatch,
  };
};