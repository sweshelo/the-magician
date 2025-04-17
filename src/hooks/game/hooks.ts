import { useGameStore } from './context';

// Zustandの推奨に従い、空配列リテラルは返さずundefinedを許容するhooks群
// すべてのplayer state accessorを集約

export const usePlayer = (playerId: string) => useGameStore(state => state.players?.[playerId]);

export const useField = (playerId: string) =>
  useGameStore(state => state.players?.[playerId]?.field);

export const useHand = (playerId: string) => useGameStore(state => state.players?.[playerId]?.hand);

export const useDeck = (playerId: string) => useGameStore(state => state.players?.[playerId]?.deck);

export const useTrash = (playerId: string) =>
  useGameStore(state => state.players?.[playerId]?.trash);

export const useTrigger = (playerId: string) =>
  useGameStore(state => state.players?.[playerId]?.trigger);

export const useRule = () => useGameStore(state => state.rule);

export const usePlayers = () => useGameStore(state => state.players);

// 必要に応じて他のstate accessorもここに追加
