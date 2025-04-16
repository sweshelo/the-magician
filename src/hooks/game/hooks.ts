import { useGameStore } from './context';

const empty: never[] = [];

const usePlayer = (playerId: string) => useGameStore(state => state.players?.[playerId]);
const useField = (playerId: string) =>
  useGameStore(state => state.players?.[playerId]?.field ?? empty);
const useHand = (playerId: string) =>
  useGameStore(state => state.players?.[playerId]?.hand ?? empty);
const useDeck = (playerId: string) =>
  useGameStore(state => state.players?.[playerId]?.deck ?? empty);
const useTrash = (playerId: string) =>
  useGameStore(state => state.players?.[playerId]?.trash ?? empty);
const useTrigger = (playerId: string) =>
  useGameStore(state => state.players?.[playerId]?.trigger ?? empty);

export { useField, useHand, useDeck, useTrash, useTrigger, usePlayer };
