'use client';

import { createContext, ReactNode, useContext, useState, useCallback } from 'react';

export type PlayerRole = 'player' | 'spectator' | 'unknown';

interface PlayerIdentityState {
  selfId: string | null;
  role: PlayerRole;
  isResolved: boolean;
}

interface PlayerIdentityContextType extends PlayerIdentityState {
  setSelfId: (id: string, role: 'player' | 'spectator') => void;
  clearIdentity: () => void;
}

const PlayerIdentityContext = createContext<PlayerIdentityContextType | null>(null);

// SessionStorage key prefix for room-specific identity
const SESSION_STORAGE_KEY = 'player-identity';

interface SessionStorageData {
  selfId: string;
  role: 'player' | 'spectator';
  roomId?: string;
}

function getStoredIdentity(): SessionStorageData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as SessionStorageData;
    }
  } catch (e) {
    console.error('Failed to parse stored player identity:', e);
  }
  return null;
}

function storeIdentity(data: SessionStorageData): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to store player identity:', e);
  }
}

function clearStoredIdentity(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear stored player identity:', e);
  }
}

interface Props {
  children: ReactNode;
}

export const PlayerIdentityProvider = ({ children }: Props) => {
  // Initialize state with stored value or default
  const [state, setState] = useState<PlayerIdentityState>(() => {
    const stored = getStoredIdentity();
    if (stored) {
      return {
        selfId: stored.selfId,
        role: stored.role,
        isResolved: true,
      };
    }
    // 保存データがない場合も解決済みとする
    return {
      selfId: null,
      role: 'unknown',
      isResolved: true,
    };
  });

  const setSelfId = useCallback((id: string, role: 'player' | 'spectator') => {
    setState({
      selfId: id,
      role,
      isResolved: true,
    });

    // Store in SessionStorage for page reload persistence
    storeIdentity({ selfId: id, role });
  }, []);

  const clearIdentity = useCallback(() => {
    setState({
      selfId: null,
      role: 'unknown',
      isResolved: true,
    });
    clearStoredIdentity();
  }, []);

  return (
    <PlayerIdentityContext.Provider
      value={{
        ...state,
        setSelfId,
        clearIdentity,
      }}
    >
      {children}
    </PlayerIdentityContext.Provider>
  );
};

export const usePlayerIdentity = (): PlayerIdentityContextType => {
  const context = useContext(PlayerIdentityContext);
  if (!context) {
    throw new Error('usePlayerIdentity must be used within a PlayerIdentityProvider');
  }
  return context;
};
