import { useContext } from 'react'

import { Player } from "@/type/game/Player";
import { GameContext, GameContextType } from "./context";
import { GameState } from './reducer';

const useGameContext = (): GameContextType => {
  const context = useContext(GameContext)
  if (context == null) throw Error('useGameContext must be used within a GameProvider')
  return context
}

/**
 * カスタムフックとしてGameContextのstateと、dispatchをラップしたヘルパー関数を提供します。
 * 以前のsetTurnやsetRoundなどのAPIに合わせ、dispatchを利用した更新関数を実装しています。
 */
export const useGame = () => {
  const { state, dispatch } = useGameContext()

  const setTurn = (turn: number): void => dispatch({ type: 'SET_TURN', turn })
  const setRound = (round: number): void => dispatch({ type: 'SET_ROUND', round })
  const setPlayer = (player: Player): void => dispatch({ type: 'SET_PLAYER', player })
  const setAll = (game: GameState): void => dispatch({ type: 'SET_ALL', game })

  return {
    ...state,
    setTurn,
    setRound,
    setPlayer,
    setAll,
  }
}
