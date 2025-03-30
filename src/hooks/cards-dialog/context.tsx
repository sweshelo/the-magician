'use client';

import { IAtom } from "@/submodule/suit/types";
import { createContext, ReactNode, useState } from "react";

export type CardsDialogContextType = {
  cards: IAtom[] | undefined;
  setCards: React.Dispatch<React.SetStateAction<IAtom[] | undefined>>;
  dialogTitle: string;
  setDialogTitle: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
}

export const CardsDialogContext = createContext<CardsDialogContextType | undefined>(undefined);

export const CardsDialogProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<IAtom[] | undefined>(undefined);
  const [dialogTitle, setDialogTitle] = useState<string>("");

  // Dialog is open when there are cards to display
  const isOpen = cards !== undefined;

  return (
    <CardsDialogContext.Provider value={{
      cards,
      setCards,
      dialogTitle,
      setDialogTitle,
      isOpen
    }}>
      {children}
    </CardsDialogContext.Provider>
  )
}
