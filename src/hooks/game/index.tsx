'use client';

import { Card } from "@/type/game/Card";
import { Player } from "@/type/game/Player";
import { createContext, ReactNode, SetStateAction, useState } from "react";

type GameContextType = {
  players: Player[] | undefined
  setPlayers: React.Dispatch<SetStateAction<Player[] | undefined>>
  selectedCard: Card | undefined;
  setSelectedCard: React.Dispatch<SetStateAction<Card | undefined>>
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>();
  const [selectedCard, setSelectedCard] = useState<Card>();

  return (
    <GameContext.Provider value={{
      players,
      setPlayers,
      selectedCard,
      setSelectedCard,
    }}>
      {children}
    </GameContext.Provider>
  )
}