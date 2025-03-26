'use client';

import { ICard } from "@/submodule/suit/types";
import { createContext, ReactNode, useState } from "react";

type SystemContextType = {
  selectedCard: ICard | undefined
  setSelectedCard: React.Dispatch<React.SetStateAction<ICard | undefined>>
}

export const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCard, setSelectedCard] = useState<ICard | undefined>(undefined);

  return (
    <SystemContext.Provider value={{
      selectedCard,
      setSelectedCard,      
    }}>
      {children}
    </SystemContext.Provider>
  )
}