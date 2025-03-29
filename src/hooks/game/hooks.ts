'use client';

import { useContext, useMemo, useState, useEffect } from 'react'

import { Player } from "@/type/game/Player";
import { GameContext, GameContextType } from "./context";
import { GameState } from './reducer';
import { LocalStorageHelper } from '@/service/local-storage';
import { IAtom, IPlayer, IUnit } from '@/submodule/suit/types';
import { Card } from '@/type/game/Card';

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

  // Using useState + useEffect to ensure this only runs on the client
  const [selfPlayerId, setSelfPlayerId] = useState<string>('initial-id')

  // This effect will only run on the client side
  useEffect(() => {
    setSelfPlayerId(LocalStorageHelper.playerId())
  }, [])

  const self = useMemo<IPlayer | undefined>(() => state.players?.[selfPlayerId], [state.players, selfPlayerId])
  const selfStatus = useMemo(() => ({
    id: self?.id,
    name: self?.name,
    cp: self?.cp,
    life: self?.life,
  }), [self])
  const selfHand = useMemo<Card[]>(() => (self?.hand ?? []) as Card[], [self])
  const selfDeck = useMemo<IAtom[]>(() => (self?.deck ?? []), [self])
  const selfField = useMemo<IUnit[]>(() => self?.field ?? [], [self])

  const opponent = useMemo<IPlayer | undefined>(() => state.players && Object.entries(state.players).find(([key]) => key !== selfPlayerId)?.[1], [state.players, selfPlayerId])
  const opponentStatus = useMemo(() => ({
    id: opponent?.id,
    name: opponent?.name,
    cp: opponent?.cp,
    life: opponent?.life,
  }), [opponent])
  const opponentHand = useMemo<IAtom[]>(() => opponent?.hand ?? [], [opponent])
  const opponentDeck = useMemo<IAtom[]>(() => (opponent?.deck ?? []), [opponent])
  const opponentField = useMemo<IUnit[]>(() => opponent?.field ?? [], [opponent])

  return {
    ...state,
    setTurn,
    setRound,
    setPlayer,
    setAll,
    self: {
      status: selfStatus,
      hand: selfHand,
      field: selfField,
      deck: selfDeck,
    },
    opponent: {
      status: opponentStatus,
      hand: opponentHand,
      deck: opponentDeck,
      field: opponentField,
    }
  }
}
