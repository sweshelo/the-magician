'use client';

import { useContext } from 'react';
import { CardsDialogContext, CardsDialogContextType } from './context';
import { IAtom } from '@/submodule/suit/types';
import { useSoundEffect } from '../sound/hooks';

export const useCardsDialog = (): CardsDialogContextType & {
  openCardsDialog: (cards: IAtom[], title: string) => void;
  closeCardsDialog: () => void;
} => {
  const context = useContext(CardsDialogContext);
  if (context === undefined) {
    throw new Error('useCardsDialog must be used within a CardsDialogProvider');
  }

  const { open } = useSoundEffect();

  // Function to open cards dialog with the provided cards and title
  const openCardsDialog = (cards: IAtom[], title: string) => {
    context.setCards(cards);
    context.setDialogTitle(title);
    open(); // Play the open sound effect
  };

  // Function to close the dialog by clearing the cards array
  const closeCardsDialog = () => {
    context.setCards(undefined);
  };

  return {
    ...context,
    openCardsDialog,
    closeCardsDialog,
  };
};
