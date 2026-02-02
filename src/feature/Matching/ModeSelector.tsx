'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/component/interface/button';
import { DeckService } from '@/service/deck-service';
import type { MatchingMode } from '@/submodule/suit/types/message/payload/server';
import type { DeckData } from '@/type/deck';

interface ModeInfo {
  mode: MatchingMode;
  label: string;
  description: string;
}

const MODES: ModeInfo[] = [
  {
    mode: 'freedom',
    label: 'フリーダム',
    description: '制限なし。全カード使用可能。',
  },
  {
    mode: 'standard',
    label: 'スタンダード',
    description: 'Ver.1.2以降のカードのみ。同名カード3枚まで。',
  },
  {
    mode: 'legacy',
    label: 'レガシー',
    description: 'Ver.1.4EX3以前。1stジョーカー、手札加算方式。',
  },
  {
    mode: 'limited',
    label: 'リミテッド',
    description: 'デッキ合計オリジナリティ100以上必須。',
  },
];

interface Props {
  onSelectMode: (mode: MatchingMode) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const ModeSelector = ({ onSelectMode, onCancel, isLoading }: Props) => {
  const [mainDeck, setMainDeck] = useState<DeckData | null>(null);
  const [deckValidation, setDeckValidation] = useState<Record<MatchingMode, boolean>>({
    freedom: false,
    standard: false,
    legacy: false,
    limited: false,
  });

  useEffect(() => {
    const loadDeck = async () => {
      const deck = await DeckService.getMainDeck(null);
      setMainDeck(deck);

      if (deck) {
        // TODO: Implement actual validation based on card catalog data
        // For now, all modes are considered valid if deck exists
        setDeckValidation({
          freedom: true,
          standard: true,
          legacy: true,
          limited: true,
        });
      }
    };

    loadDeck();
  }, []);

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

      {!mainDeck && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700 text-sm">
            メインデッキが設定されていません。デッキ編集画面でメインデッキを設定してください。
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {MODES.map(({ mode, label, description }) => {
          const isValid = deckValidation[mode];
          const isDisabled = !mainDeck || !isValid || isLoading;

          return (
            <button
              key={mode}
              onClick={() => handleSelectMode(mode)}
              disabled={isDisabled}
              className={`
                relative p-4 rounded-lg border-2 text-left transition-all
                ${
                  isDisabled
                    ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
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
                    w-3 h-3 rounded-full flex-shrink-0 ml-3
                    ${isValid ? 'bg-green-500' : 'bg-red-500'}
                  `}
                  title={isValid ? 'デッキ条件適合' : 'デッキ条件不適合'}
                />
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
