'use client';

import { Card } from "@/type/game/Card";
import { Player } from "@/type/game/Player";
import { createContext, ReactNode, SetStateAction, useState } from "react";

type GameContextType = {
  players: Player[] | undefined
  setPlayers: React.Dispatch<SetStateAction<Player[] | undefined>>
  turn: number;
  setTurn: React.Dispatch<SetStateAction<number>>;
  round: number;
  setRound: React.Dispatch<SetStateAction<number>>;
  selectedCard: Card | undefined;
  setSelectedCard: React.Dispatch<SetStateAction<Card | undefined>>
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [turn, setTurn] = useState<number>(0);
  const [round, setRound] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>();
  const [selectedCard, setSelectedCard] = useState<Card>();

  return (
    <GameContext.Provider value={{
      players,
      setPlayers,
      selectedCard,
      setSelectedCard,
      turn,
      setTurn,
      round,
      setRound,
    }}>
      {children}
    </GameContext.Provider>
  )
}