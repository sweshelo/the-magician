'use client';

import { ICard } from "@/submodule/suit/types";
import { createContext, ReactNode, useState } from "react";

export type SystemContextType = {
  selectedCard: ICard | undefined
  setSelectedCard: React.Dispatch<React.SetStateAction<ICard | undefined>>
  operable: boolean
  setOperable: React.Dispatch<React.SetStateAction<boolean>>
}

export const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCard, setSelectedCard] = useState<ICard | undefined>(undefined);
  const [operable, setOperable] = useState(true); // Debug用. 本当は初期値 false

  return (
    <SystemContext.Provider value={{
      selectedCard,
      setSelectedCard,
      operable,
      setOperable,
    }}>
      {children}
    </SystemContext.Provider>
  )
}