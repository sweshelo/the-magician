'use client';

import { LoadingOverlay } from '@/component/ui/LoadingOverlay';

interface SearchingViewProps {
  queuePosition?: number;
  estimatedWaitTime?: number;
  onCancel: () => void;
}

export function SearchingView({ queuePosition, estimatedWaitTime, onCancel }: SearchingViewProps) {
  const getSubMessage = () => {
    if (queuePosition !== undefined && estimatedWaitTime !== undefined) {
      return `待機位置: ${queuePosition}番目 (約${estimatedWaitTime}秒)`;
    }
    if (queuePosition !== undefined) {
      return `待機位置: ${queuePosition}番目`;
    }
    return '対戦相手を探しています...';
  };

  return (
    <LoadingOverlay
      isOpen={true}
      message="マッチング中"
      subMessage={getSubMessage()}
      showExitButton={true}
      exitButtonText="キャンセル"
      onExit={onCancel}
    />
  );
}
