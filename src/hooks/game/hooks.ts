import { useGameStore } from './context';
import { useShallow } from 'zustand/shallow';

export const usePlayer = (playerId: string) => {
  const [player] = useGameStore(useShallow(state => [state.players?.[playerId]]));
  return player;
};

export const useField = (playerId: string) => {
  const [field] = useGameStore(useShallow(state => [state.players?.[playerId]?.field]));
  return field;
};

export const useHand = (playerId: string) => {
  const [hand] = useGameStore(useShallow(state => [state.players?.[playerId]?.hand]));
  return hand;
};

export const useDeck = (playerId: string) => {
  const [deck] = useGameStore(useShallow(state => [state.players?.[playerId]?.deck]));
  return deck;
};

export const useTrash = (playerId: string) => {
  const [trash] = useGameStore(useShallow(state => [state.players?.[playerId]?.trash]));
  return trash;
};

export const useTrigger = (playerId: string) => {
  const [trigger] = useGameStore(useShallow(state => [state.players?.[playerId]?.trigger]));
  return trigger;
};

export const useRule = () => {
  const [rule] = useGameStore(useShallow(state => [state.rule]));
  return rule;
};

export const usePlayers = () => {
  const [players] = useGameStore(useShallow(state => [state.players]));
  return players;
};
