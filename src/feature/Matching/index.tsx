'use client';

import { useEffect } from 'react';
import { useMatching } from './hooks';
import { ModeSelector } from './components/ModeSelector';
import { SearchingView } from './components/SearchingView';
import { MatchFoundView } from './components/MatchFoundView';
import type { MatchingMode } from './context';
import { useErrorOverlay } from '@/hooks/error-overlay';

export function Matching() {
  const matching = useMatching();
  const { showError } = useErrorOverlay();

  // Handle mode selection
  const handleModeSelect = async (mode: MatchingMode) => {
    try {
      await matching.startMatching(mode);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : 'マッチングの開始に失敗しました',
        'エラー'
      );
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    try {
      await matching.cancelMatching();
    } catch (error) {
      console.error('Failed to cancel matching:', error);
      // Even if cancel fails, navigate back
      window.history.back();
    }
  };

  // Browser close warning when matching
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (matching.status === 'searching') {
        e.preventDefault();
        e.returnValue = 'マッチング中です。本当に終了しますか？';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [matching.status]);

  // Render appropriate view based on status
  if (matching.status === 'selecting') {
    return <ModeSelector onModeSelect={handleModeSelect} />;
  }

  if (matching.status === 'searching') {
    return (
      <SearchingView
        queuePosition={matching.queuePosition}
        estimatedWaitTime={matching.estimatedWaitTime}
        onCancel={handleCancel}
      />
    );
  }

  if (matching.status === 'found' && matching.matchedRoomId && matching.opponent) {
    return <MatchFoundView roomId={matching.matchedRoomId} opponent={matching.opponent} />;
  }

  // Error or cancelled state - show mode selector
  return <ModeSelector onModeSelect={handleModeSelect} />;
}
