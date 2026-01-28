import { usePlayerIdentity } from './context';
import { LocalStorageHelper } from '@/service/local-storage';

/**
 * Get the current player's ID.
 * Uses PlayerIdentityContext if resolved, otherwise falls back to LocalStorageHelper.
 * This allows for graceful migration and ensures backward compatibility.
 */
export const useSelfId = (): string => {
  const { selfId, isResolved } = usePlayerIdentity();

  // During migration period: use Context if resolved, otherwise fallback
  if (isResolved && selfId) {
    return selfId;
  }

  // Fallback to LocalStorageHelper for backward compatibility
  return LocalStorageHelper.playerId();
};

/**
 * Check if the current user is a spectator.
 * Returns false for players and during the resolution period.
 */
export const useIsSpectator = (): boolean => {
  const { role, isResolved } = usePlayerIdentity();

  // Only return true if explicitly resolved as spectator
  if (!isResolved) return false;
  return role === 'spectator';
};

/**
 * Check if the current user is a player (not a spectator).
 * Returns true for players and during the resolution period (default assumption).
 */
export const useIsPlayer = (): boolean => {
  const { role, isResolved } = usePlayerIdentity();

  // During resolution period, assume player (backward compatible)
  if (!isResolved) return true;
  return role === 'player';
};
