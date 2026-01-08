'use client';

import { LocalStorageHelper } from '@/service/local-storage';
import { Button } from '@/component/interface/button';
import type { MatchingMode } from '../context';

interface ModeSelectorProps {
  onModeSelect: (mode: MatchingMode) => void;
}

export function ModeSelector({ onModeSelect }: ModeSelectorProps) {
  const mainDeck = LocalStorageHelper.getMainDeck();
  const isDeckValid = mainDeck && mainDeck.cards.length === 40;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">マッチング</h1>
          <p className="text-lg text-gray-300">対戦モードを選択してください</p>
        </div>

        {/* Deck Validation Badge */}
        <div
          className={`p-4 rounded-lg border-2 ${
            isDeckValid
              ? 'bg-green-900/20 border-green-500 text-green-300'
              : 'bg-red-900/20 border-red-500 text-red-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {isDeckValid ? '✓ デッキ準備完了' : '✗ デッキが未設定です'}
            </span>
            <span className="text-sm">
              {mainDeck ? `${mainDeck.cards.length} / 40 枚` : '0 / 40 枚'}
            </span>
          </div>
          {!isDeckValid && (
            <p className="text-sm mt-2 opacity-80">
              マッチングを開始するには、40枚のカードでデッキを構築してください。
            </p>
          )}
        </div>

        {/* Mode Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onModeSelect('random')}
            disabled={!isDeckValid}
            className={`
              group relative p-8 rounded-xl border-2 transition-all duration-200
              ${
                isDeckValid
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 hover:from-purple-500 hover:to-pink-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer'
                  : 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-50'
              }
            `}
          >
            <div className="text-center space-y-3">
              <div className="text-4xl">🎲</div>
              <h3 className="text-2xl font-bold text-white">ランダムマッチ</h3>
              <p className="text-sm text-gray-200 opacity-90">誰とでも気軽に対戦</p>
            </div>
            {isDeckValid && (
              <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            )}
          </button>

          <button
            disabled
            className="group relative p-8 rounded-xl border-2 bg-gray-800 border-gray-700 cursor-not-allowed opacity-50"
          >
            <div className="text-center space-y-3">
              <div className="text-4xl">⚔️</div>
              <h3 className="text-2xl font-bold text-white">レート戦</h3>
              <p className="text-sm text-gray-300 opacity-70">準備中</p>
            </div>
          </button>

          <button
            disabled
            className="group relative p-8 rounded-xl border-2 bg-gray-800 border-gray-700 cursor-not-allowed opacity-50"
          >
            <div className="text-center space-y-3">
              <div className="text-4xl">⚙️</div>
              <h3 className="text-2xl font-bold text-white">ルール指定</h3>
              <p className="text-sm text-gray-300 opacity-70">準備中</p>
            </div>
          </button>
        </div>

        {/* Back Button */}
        <div className="flex justify-center pt-4">
          <Button variant="text" size="md" onClick={() => window.history.back()}>
            ← 戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
