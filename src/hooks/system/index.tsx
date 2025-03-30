'use client';

import { ICard } from "@/submodule/suit/types";
import { Active } from "@dnd-kit/core/dist/store";

import { createContext, ReactNode, useState } from "react";

export type SystemContextType = {
  selectedCard: ICard | undefined
  setSelectedCard: React.Dispatch<React.SetStateAction<ICard | undefined>>
  activeCard: Active | undefined
  setActiveCard: React.Dispatch<React.SetStateAction<Active | undefined>>
  operable: boolean
  setOperable: React.Dispatch<React.SetStateAction<boolean>>
  // Removed openDeck, setOpenDeck, openTrash, setOpenTrash
  // These are now handled by the CardsDialog context
}

export const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemContextProvider = ({ children }: { children: ReactNode }) => {
  // 詳細用
  const [selectedCard, setSelectedCard] = useState<ICard | undefined>(undefined);
  // ドラッグ中のカード
  const [activeCard, setActiveCard] = useState<Active | undefined>(undefined);
  const [operable, setOperable] = useState(true); // Debug用. 本当は初期値 false

  return (
    <SystemContext.Provider value={{
      selectedCard,
      setSelectedCard,
      operable,
      setOperable,
      activeCard,
      setActiveCard,
    }}>
      {children}
    </SystemContext.Provider>
  )
}
