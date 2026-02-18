'use client';

import { useState } from 'react';
import { useDeck } from '@/hooks/deck';
import { DeckPreview } from '@/feature/DeckBuilder/DeckPreview';
import { originality } from '@/helper/originality';
import { useOriginalityMap } from '@/hooks/originality';
import { DeckListModal } from '@/component/ui/DeckListModal';
import Link from 'next/link';

export const DeckSelector = () => {
  const { decks, mainDeck, isLoading, setMainDeck } = useDeck();
  const { opMap, isLoading: isOpLoading } = useOriginalityMap();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeckListOpen, setIsDeckListOpen] = useState(false);
  const [deckError, setDeckError] = useState<string | null>(null);

  const handleSetMainDeck = async (deckId: string) => {
    setDeckError(null);
    try {
      await setMainDeck(deckId);
      setIsDeckListOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'メインデッキの設定に失敗しました';
      setDeckError(message);
      console.error('メインデッキ設定エラー:', error);
    }
  };

  const handlePreview = () => {
    if (mainDeck && mainDeck.cards.length > 0) {
      setIsPreviewOpen(true);
    }
  };

  const getDeckStatus = () => {
    if (!mainDeck) {
      return { text: 'デッキが設定されていません', color: 'text-red-400' };
    }
    if (mainDeck.cards.length !== 40) {
      return {
        text: `デッキ枚数が不正です (${mainDeck.cards.length}/40枚)`,
        color: 'text-yellow-400',
      };
    }
  };

  const status = getDeckStatus();

  if (isLoading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-3"></div>
        <div className="h-20 bg-gray-700 rounded mb-4"></div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-700 rounded w-24"></div>
          <div className="h-10 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-3">デッキ設定</h3>

      {/* Current Deck Info */}
      <div className="mb-4 p-3 bg-gray-700 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">{mainDeck ? mainDeck.title : '未設定'}</span>
          {status && <span className={`text-sm ${status.color}`}>{status.text}</span>}
          {mainDeck && (
            <div className="text-gray-400 text-sm">
              Originality{' '}
              {isOpLoading
                ? '...'
                : originality([...mainDeck.cards, ...(mainDeck.jokers ?? [])], opMap)}
              P
            </div>
          )}
        </div>

        {mainDeck && <div className="text-gray-400 text-sm">{mainDeck.cards.length}枚のカード</div>}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-4">
        <button
          onClick={handlePreview}
          disabled={!mainDeck || mainDeck.cards.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          プレビュー
        </button>

        <button
          onClick={() => setIsDeckListOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          デッキ選択
        </button>
        <Link
          href={'/deck'}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          デッキ管理
        </Link>
      </div>

      {/* Error message */}
      {deckError && (
        <div className="p-3 bg-red-900 border border-red-600 rounded-md mb-4">
          <p className="text-red-200 text-sm">{deckError}</p>
        </div>
      )}

      {/* No deck warning */}
      {!mainDeck && (
        <div className="p-3 bg-red-900 border border-red-600 rounded-md">
          <p className="text-red-200 text-sm">
            ゲームを開始するには、メインデッキを設定してください。
            デッキビルダーでデッキを作成し、メインデッキに設定するか、
            既存のデッキから選択してください。
          </p>
        </div>
      )}

      {/* Deck List Modal */}
      <DeckListModal
        isOpen={isDeckListOpen}
        onClose={() => setIsDeckListOpen(false)}
        decks={decks}
        mainDeckId={mainDeck?.id ?? null}
        onSelectDeck={handleSetMainDeck}
        originalityMap={opMap}
        isOriginalityLoading={isOpLoading}
      />

      {/* Deck Preview Modal */}
      {isPreviewOpen && mainDeck && (
        <DeckPreview
          deck={{ cards: mainDeck.cards, jokers: mainDeck.jokers }}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};
