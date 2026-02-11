'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/hooks/auth';
import { DeckService } from '@/service/deck-service';
import type { DeckData } from '@/type/deck';

export type DeckContextType = {
  decks: DeckData[];
  mainDeck: DeckData | null;
  isLoading: boolean;
  error: string | null;
  // 操作
  refreshDecks: () => Promise<void>;
  saveDeck: (
    title: string,
    cards: string[],
    jokers?: string[],
    isMain?: boolean
  ) => Promise<DeckData>;
  deleteDeck: (deckId: string) => Promise<void>;
  setMainDeck: (deckId: string) => Promise<void>;
  // マイグレーション
  migrateFromLocalStorage: () => Promise<{ success: number; failed: number }>;
  clearLocalStorage: () => void;
  hasLocalDecks: boolean;
};

export const DeckContext = createContext<DeckContextType | undefined>(undefined);

type DeckProviderProps = {
  children: ReactNode;
};

export const DeckProvider = ({ children }: DeckProviderProps) => {
  const { user, isAuthSkipped, isLoading: isAuthLoading } = useAuth();
  const [decks, setDecks] = useState<DeckData[]>([]);
  const [mainDeck, setMainDeckState] = useState<DeckData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLocalDecks, setHasLocalDecks] = useState(false);

  const userId = !isAuthSkipped ? (user?.id ?? null) : null;

  // デッキを読み込み
  const refreshDecks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [allDecks, main] = await Promise.all([
        DeckService.getAllDecks(userId),
        DeckService.getMainDeck(userId),
      ]);

      setDecks(allDecks);
      setMainDeckState(main);

      // ログイン中かつLocalStorageにデッキがあるかチェック
      if (userId && !isAuthSkipped) {
        const { LocalStorageHelper } = await import('@/service/local-storage');
        const localDecks = LocalStorageHelper.getAllDecks();
        setHasLocalDecks(localDecks.length > 0);
      } else {
        setHasLocalDecks(false);
      }
    } catch (err) {
      console.error('デッキ読み込みエラー:', err);
      setError('デッキの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [userId, isAuthSkipped]);

  // 認証状態が確定したらデッキを読み込み
  useEffect(() => {
    if (!isAuthLoading) {
      refreshDecks();
    }
  }, [isAuthLoading, refreshDecks]);

  // デッキを保存
  const saveDeck = useCallback(
    async (
      title: string,
      cards: string[],
      jokers: string[] = [],
      isMain: boolean = false
    ): Promise<DeckData> => {
      const saved = await DeckService.saveDeck(
        isAuthSkipped ? null : userId,
        title,
        cards,
        jokers,
        isMain
      );
      await refreshDecks();
      return saved;
    },
    [userId, isAuthSkipped, refreshDecks]
  );

  // デッキを削除
  const deleteDeck = useCallback(
    async (deckId: string): Promise<void> => {
      await DeckService.deleteDeck(userId, deckId);
      await refreshDecks();
    },
    [userId, refreshDecks]
  );

  // メインデッキを設定
  const setMainDeck = useCallback(
    async (deckId: string): Promise<void> => {
      await DeckService.setMainDeck(userId, deckId);
      await refreshDecks();
    },
    [userId, refreshDecks]
  );

  // LocalStorageから移行
  const migrateFromLocalStorage = useCallback(async (): Promise<{
    success: number;
    failed: number;
  }> => {
    if (!userId) {
      throw new Error('ログインが必要です');
    }

    const result = await DeckService.migrateFromLocalStorage(userId);
    await refreshDecks();
    return result;
  }, [userId, refreshDecks]);

  // LocalStorageをクリア
  const clearLocalStorage = useCallback(() => {
    DeckService.clearLocalStorage();
    setHasLocalDecks(false);
  }, []);

  const value = useMemo(
    () => ({
      decks,
      mainDeck,
      isLoading: isLoading || isAuthLoading,
      error,
      refreshDecks,
      saveDeck,
      deleteDeck,
      setMainDeck,
      migrateFromLocalStorage,
      clearLocalStorage,
      hasLocalDecks,
    }),
    [
      decks,
      mainDeck,
      isLoading,
      isAuthLoading,
      error,
      refreshDecks,
      saveDeck,
      deleteDeck,
      setMainDeck,
      migrateFromLocalStorage,
      clearLocalStorage,
      hasLocalDecks,
    ]
  );

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
};
