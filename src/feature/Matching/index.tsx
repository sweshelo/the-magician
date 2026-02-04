'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/component/interface/button';
import { useMatching, useQueueStatus } from '@/hooks/matching';
import { useErrorOverlay } from '@/hooks/error-overlay';
import { webSocketService } from '@/service/websocket';
import { ModeSelector } from './ModeSelector';
import { WaitingScreen } from './WaitingScreen';
import { useMatchingRequest } from './hooks';
import type { MatchingMode } from '@/submodule/suit/types/message/payload/server';
import { useAuth } from '@/hooks/auth';
import { getPlayStatus } from '@/actions/play';
import Link from 'next/link';

export const Matching = () => {
  const router = useRouter();
  const { user, isAuthSkipped } = useAuth();
  const { state, startSelecting, cancel, reset } = useMatching();
  const { startMatching, cancelMatching } = useMatchingRequest();
  const { showError } = useErrorOverlay();
  const [isLoading, setIsLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  // キュー状態をリッスン＆リクエスト
  const { requestQueueStatus } = useQueueStatus();

  // Navigate to room when matched
  useEffect(() => {
    if (state.status === 'matched' && state.roomId) {
      router.push(`/room/${state.roomId}`);
      reset();
    }
  }, [state.status, state.roomId, router, reset]);

  // マッチングエラーハンドラーを設定
  useEffect(() => {
    webSocketService.setMatchingErrorHandler(errorCode => {
      console.log('Matching error received:', errorCode);
      setIsLoading(false);
      setIsCanceling(false);
      cancel();
    });

    return () => {
      webSocketService.setMatchingErrorHandler(null);
    };
  }, [cancel]);

  const handleStartMatching = useCallback(() => {
    startSelecting();
    // マッチング状況をサーバーにリクエスト
    requestQueueStatus();
  }, [startSelecting, requestQueueStatus]);

  const handleSelectMode = useCallback(
    async (mode: MatchingMode) => {
      setIsLoading(true);
      try {
        // プレイ可能かチェック
        const status = await getPlayStatus();
        if (!status.canPlay) {
          showError(status.message ?? 'プレイ可能回数がありません', 'プレイ制限');
          cancel();
          return;
        }

        await startMatching(mode);
      } catch (error) {
        console.error('Failed to start matching:', error);
        showError(
          error instanceof Error ? error.message : 'マッチングの開始に失敗しました',
          'マッチングエラー'
        );
        cancel();
      } finally {
        setIsLoading(false);
      }
    },
    [startMatching, showError, cancel]
  );

  const handleCancel = useCallback(async () => {
    if (state.status === 'waiting') {
      setIsCanceling(true);
      try {
        await cancelMatching();
      } catch (error) {
        console.error('Failed to cancel matching:', error);
        // Even if cancel fails, reset local state
        cancel();
      } finally {
        setIsCanceling(false);
      }
    } else {
      cancel();
    }
  }, [state.status, cancelMatching, cancel]);

  if (!user && !isAuthSkipped)
    return (
      <div className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-center text-xl font-bold mb-4 text-gray-400">ランダムマッチ</h2>
        <div className="flex justify-center text-gray-400">
          利用には <Link href={'/login'}>ログイン</Link> が必要です
        </div>
      </div>
    );

  if (state.status === 'idle') {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-center text-xl font-bold mb-4 text-gray-400">ランダムマッチ</h2>
        <div className="flex flex-col justify-center gap-1">
          <div className="bg-gray-800 p-2 text-white rounded">
            <p className="text-center text-sm">注意</p>
            <ul className="text-xs">
              <li>
                いつでも対戦が可能になる特性上、サーバの運用コストを抑えるために1日あたりの回数制限があります
              </li>
              <li>マリガンが開始された時点でプレイ回数を消費します</li>
              <li>
                何か問題が発生した際には<span className="text-red-500">まずリロード</span>
                をお試し下さい
              </li>
              <li>技術的トラブルやバグを含めプレイ回数の復旧は行いません</li>
              <li>
                まずルーム作成による対戦によってプレイが正常に行えることを確認してから参加して下さい
              </li>
            </ul>
          </div>
          <Button type="button" onClick={handleStartMatching}>
            上記事項に同意しました
          </Button>
        </div>
      </div>
    );
  }

  if (state.status === 'selecting') {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto">
        <ModeSelector
          onSelectMode={handleSelectMode}
          onCancel={handleCancel}
          isLoading={isLoading}
          queueCounts={state.queueCounts}
        />
      </div>
    );
  }

  if (state.status === 'waiting' && state.mode) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto">
        <WaitingScreen
          mode={state.mode}
          position={state.position}
          onCancel={handleCancel}
          isCanceling={isCanceling}
        />
      </div>
    );
  }

  return null;
};
