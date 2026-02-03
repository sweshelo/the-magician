'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/component/interface/button';
import { useDeck } from '@/hooks/deck';
import type { MatchingMode } from '@/submodule/suit/types/message/payload/server';
import master from '@/submodule/suit/catalog/catalog';
import { Tooltip } from 'react-tooltip';

interface ModeInfo {
  mode: MatchingMode;
  label: string;
  description: string;
}

const MODES: ModeInfo[] = [
  {
    mode: 'freedom',
    label: 'FREEDOM',
    description: '制限なし。全カード使用可能。',
  },
  {
    mode: 'standard',
    label: 'STANDARD',
    description: 'Ver.1.2以降のカードのみ。同名カード3枚まで。',
  },
  {
    mode: 'legacy',
    label: 'LEGACY',
    description: 'Ver.1.4EX3以前のルール／カードプールに準拠。',
  },
  {
    mode: 'limited',
    label: 'LIMITED',
    description: 'デッキ合計オリジナリティ100以上必須。',
  },
];

interface Props {
  onSelectMode: (mode: MatchingMode) => void;
  onCancel: () => void;
  isLoading: boolean;
  queueCounts: Record<MatchingMode, number>;
}

// インジケータの色を決定
const getIndicatorColor = (isValid: boolean, queueCount: number): string => {
  if (queueCount > 0) {
    return isValid ? 'bg-green-500' : 'bg-orange-500';
  }
  return isValid ? 'bg-gray-400' : 'bg-red-500';
};

// インジケータのツールチップを決定
const getIndicatorTooltip = (isValid: boolean, queueCount: number): string => {
  if (!isValid) return 'デッキ条件不適合';
  if (queueCount > 0) return `待機中: ${queueCount}人`;
  return '待機中: 0人';
};

export const ModeSelector = ({ onSelectMode, onCancel, isLoading, queueCounts }: Props) => {
  const { mainDeck, isLoading: isDeckLoading } = useDeck();
  const [deckValidation, setDeckValidation] = useState<Record<MatchingMode, boolean>>({
    freedom: false,
    standard: false,
    legacy: false,
    limited: false,
  });

  useEffect(() => {
    if (mainDeck) {
      // TODO: Implement actual validation based on card catalog data
      // For now, all modes are considered valid if deck exists
      setDeckValidation({
        freedom: true,
        standard: !mainDeck.cards.some(cardId => (master.get(cardId)?.info.version ?? 0) < 6),
        legacy: !mainDeck.cards.some(cardId => (master.get(cardId)?.info.version ?? 0) > 14),
        limited:
          mainDeck.cards.reduce((sum, cardId) => (master.get(cardId)?.originality ?? 0) + sum, 0) >=
          100,
      });
    }
  }, [mainDeck]);

  const handleSelectMode = useCallback(
    (mode: MatchingMode) => {
      if (!mainDeck) return;
      if (!deckValidation[mode]) return;
      onSelectMode(mode);
    },
    [mainDeck, deckValidation, onSelectMode]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 text-center">マッチングモード選択</h3>

      {!mainDeck && !isDeckLoading && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700 text-sm">
            メインデッキが設定されていません。デッキ編集画面でメインデッキを設定してください。
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {MODES.map(({ mode, label, description }) => {
          const isValid = deckValidation[mode];
          const isDisabled = !mainDeck || !isValid || isLoading || isDeckLoading;

          return (
            <button
              key={mode}
              onClick={() => handleSelectMode(mode)}
              disabled={isDisabled}
              className={`
                relative p-4 rounded-lg border-2 text-left transition-all
                ${
                  isDisabled
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-white border-gray-300 hover:border-indigo-500 hover:shadow-md cursor-pointer'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">{label}</span>
                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                </div>
                <div
                  className={`
                    w-5 h-5 rounded-full flex-shrink-0 ml-3
                    ${getIndicatorColor(isValid, queueCounts[mode])}
                  `}
                  title={getIndicatorTooltip(isValid, queueCounts[mode])}
                  data-tooltip-id={mode}
                />
                <Tooltip id={mode}>
                  {isDisabled && (
                    <>
                      デッキが条件を満たしていません
                      <br />
                    </>
                  )}
                  {queueCounts[mode] > 0
                    ? 'マッチング待ちのプレイヤーがいます！'
                    : 'マッチング待ちのプレイヤーはいません'}
                </Tooltip>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          キャンセル
        </Button>
      </div>
    </div>
  );
};
