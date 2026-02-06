'use client';

import { useCallback, useState } from 'react';
import { PlayLimitService, type PlayCheckResponse } from '@/service/play-limit-service';

export type UsePlayLimitReturn = {
  playStatus: PlayCheckResponse | null;
  isLoading: boolean;
  error: string | null;
  checkCanPlay: () => Promise<PlayCheckResponse>;
  recordPlay: (deckId?: string, roomId?: string) => Promise<boolean>;
};

/**
 * プレイ回数制限を管理するフック
 */
export function usePlayLimit(): UsePlayLimitReturn {
  const [playStatus, setPlayStatus] = useState<PlayCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkCanPlay = useCallback(async (): Promise<PlayCheckResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const status = await PlayLimitService.checkCanPlay();
      setPlayStatus(status);
      return status;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'プレイ状態の確認に失敗しました';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordPlay = useCallback(
    async (deckId?: string, roomId?: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await PlayLimitService.recordPlay({ deckId, roomId });

        if (result.success) {
          // プレイ状態を更新
          await checkCanPlay();
          return true;
        }

        // 失敗理由を反映し、状態も更新
        // checkCanPlayの例外は握りつぶしてresult.messageを優先
        try {
          await checkCanPlay();
        } catch {
          // noop: result.message を優先
        }
        setError(result.message ?? 'プレイ可能回数がありません');
        return false;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'プレイの記録に失敗しました';
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [checkCanPlay]
  );

  return {
    playStatus,
    isLoading,
    error,
    checkCanPlay,
    recordPlay,
  };
}
