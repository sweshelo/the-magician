import { useContext } from 'react';
import { MatchingContext, MatchingContextType, MatchingStatus } from './context';

export const useMatching = (): MatchingContextType => {
  const context = useContext(MatchingContext);
  if (context === undefined) {
    throw new Error('useMatching must be used within a MatchingProvider');
  }
  return context;
};

export const useMatchingStatus = (): MatchingStatus => {
  const { state } = useMatching();
  return state.status;
};
