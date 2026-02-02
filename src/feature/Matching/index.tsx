'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/component/interface/button';
import { useMatching } from '@/hooks/matching';
import { useErrorOverlay } from '@/hooks/error-overlay';
import { ModeSelector } from './ModeSelector';
import { WaitingScreen } from './WaitingScreen';
import { useMatchingRequest } from './hooks';
import type { MatchingMode } from '@/submodule/suit/types/message/payload/server';

export const Matching = () => {
  const router = useRouter();
  const { state, startSelecting, cancel, reset } = useMatching();
  const { startMatching, cancelMatching } = useMatchingRequest();
  const { showError } = useErrorOverlay();
  const [isLoading, setIsLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  // Navigate to room when matched
  useEffect(() => {
    if (state.status === 'matched' && state.roomId) {
      router.push(`/room/${state.roomId}`);
      reset();
    }
  }, [state.status, state.roomId, router, reset]);

  const handleStartMatching = useCallback(() => {
    startSelecting();
  }, [startSelecting]);

  const handleSelectMode = useCallback(
    async (mode: MatchingMode) => {
      setIsLoading(true);
      try {
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

  if (state.status === 'idle') {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-center text-xl font-bold mb-4 text-gray-400">ランクマッチ</h2>
        <div className="flex justify-center">
          <Button type="button" onClick={handleStartMatching}>
            マッチングを開始
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
