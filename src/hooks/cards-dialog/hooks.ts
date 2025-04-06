'use client';

import { useContext } from 'react';
import { CardsDialogContext, CardsDialogContextType } from './context';
import { ICard } from '@/submodule/suit/types';
import { useSoundEffect } from '../sound/hooks';

export const useCardsDialog = (): CardsDialogContextType & {
  openCardsDialog: (cards: ICard[], title: string) => void;
  openCardsSelector: (cards: ICard[], title: string, count: number, options?: { timeLimit?: number }) => Promise<string[]>;
  closeCardsDialog: () => void;
  confirmSelection: (result?: string[]) => void;
} => {
  const context = useContext(CardsDialogContext);
  if (context === undefined) {
    throw new Error('useCardsDialog must be used within a CardsDialogProvider');
  }

  const { open } = useSoundEffect();

  // Function to open cards dialog with the provided cards and title (viewer mode)
  const openCardsDialog = (cards: ICard[], title: string) => {
    context.setSelection([]);
    context.setResolvePromise(null);
    context.setCards(cards);
    context.setDialogTitle(title);
    context.setIsSelector(false);
    context.setCount(0);
    context.setTimeLimit(null);
    open(); // Play the open sound effect
  };

  // Function to open cards selector and return a Promise that resolves with selected card IDs
  const openCardsSelector = (
    cards: ICard[],
    title: string,
    count: number,
    options?: { timeLimit?: number }
  ): Promise<string[]> => {
    context.setSelection([]);
    context.setCards(cards);
    context.setDialogTitle(title);
    context.setIsSelector(true);
    context.setCount(count);
    context.setTimeLimit(options?.timeLimit || null);
    open(); // Play the open sound effect

    return new Promise<string[]>((resolve) => {
      context.setResolvePromise(() => resolve);
    });
  };

  // Function to confirm the current selection and resolve the promise
  const confirmSelection = (result?: string[]) => {
    if (context.resolvePromise) {
      context.resolvePromise(result ?? [...context.selection]);
      context.setResolvePromise(null);
      context.setCards(undefined);
      context.setSelection([]);
    }
  };

  // Function to close the dialog by clearing the cards array
  const closeCardsDialog = () => {
    // If there's an active promise and we're in selector mode, resolve with empty array
    if (context.resolvePromise && context.isSelector) {
      context.resolvePromise([]);
      context.setResolvePromise(null);
    }
    context.setCards(undefined);
    context.setSelection([]);
  };

  return {
    ...context,
    openCardsDialog,
    openCardsSelector,
    closeCardsDialog,
    confirmSelection,
  };
};
