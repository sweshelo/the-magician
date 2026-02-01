'use client';

import { useContext } from 'react';
import { GameResultContext, GameResultContextType } from './context';

export const useGameResult = (): GameResultContextType => {
  const context = useContext(GameResultContext);

  if (context === undefined) {
    throw new Error('useGameResult must be used within a GameResultProvider');
  }

  return context;
};
