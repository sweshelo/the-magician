import { useContext } from "react";
import { GameContext } from "@/hooks/game/index";
import { Player } from "@/type/game/Player";
import { Card } from "@/type/game/Card";

/**
 * カスタムフックとしてGameContextのstateと、dispatchをラップしたヘルパー関数を提供します。
 * 以前のsetTurnやsetRoundなどのAPIに合わせ、dispatchを利用した更新関数を実装しています。
 */
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("GameContext is not available");
  }
  const { state, dispatch } = context;

  const setTurn = (turn: number) => dispatch({ type: 'SET_TURN', turn });
  const setRound = (round: number) => dispatch({ type: 'SET_ROUND', round });
  const setPlayers = (players: Player[]) => dispatch({ type: 'SET_PLAYERS', players });
  const setSelectedCard = (card: Card) => dispatch({ type: 'SET_SELECTED_CARD', card });

  return {
    ...state,
    setTurn,
    setRound,
    setPlayers,
    setSelectedCard,
    dispatch,
  };
};
