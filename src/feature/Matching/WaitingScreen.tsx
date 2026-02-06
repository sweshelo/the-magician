'use client';

import { Button } from '@/component/interface/button';
import type { MatchingMode } from '@/submodule/suit/types/message/payload/server';

const MODE_LABELS: Record<MatchingMode, string> = {
  freedom: 'フリーダム',
  standard: 'スタンダード',
  legacy: 'レガシー',
  limited: 'リミテッド',
};

interface Props {
  mode: MatchingMode;
  position: number | null;
  onCancel: () => void;
  isCanceling: boolean;
}

export const WaitingScreen = ({ mode, position, onCancel, isCanceling }: Props) => {
  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">マッチング中...</h3>
        <p className="text-sm text-gray-500">
          モード: <span className="font-medium text-gray-700">{MODE_LABELS[mode]}</span>
        </p>
        {position !== null && (
          <p className="text-sm text-gray-500 mt-1">
            待機順位: <span className="font-medium text-gray-700">{position}</span>
          </p>
        )}
      </div>

      {/* Spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600" />
      </div>

      <p className="text-sm text-gray-400">対戦相手を探しています...</p>

      <Button type="button" variant="secondary" onClick={onCancel} disabled={isCanceling}>
        {isCanceling ? 'キャンセル中...' : 'キャンセル'}
      </Button>
    </div>
  );
};
