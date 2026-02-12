'use client';

import { useState } from 'react';
import { useDeck } from '@/hooks/deck';
import { DeckPreview } from '@/feature/DeckBuilder/DeckPreview';
import { ICard } from '@/submodule/suit/types';
import { originality } from '@/helper/originality';
import { useOriginalityMap } from '@/hooks/originality';

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

  const convertToICards = (cards: string[]): ICard[] => {
    return cards.map((catalogId, index) => ({
      id: `deck-${catalogId}-${index}`,
      catalogId,
      lv: 1,
    }));
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
      {isDeckListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <h4 className="text-lg font-semibold text-white mb-4">デッキを選択</h4>

            {decks.length === 0 ? (
              <p className="text-gray-400 text-center py-4">保存されたデッキがありません</p>
            ) : (
              <div className="space-y-2">
                {decks.map(deck => (
                  <div
                    key={deck.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      mainDeck?.id === deck.id
                        ? 'bg-blue-700 border-blue-500'
                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                    onClick={() => handleSetMainDeck(deck.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{deck.title}</span>
                      <p className="flex gap-2">
                        {(deck.jokers?.length ?? 0) < 2 && (
                          <span className="text-red-400 text-sm">JOKERなし</span>
                        )}
                        <span className="text-gray-400 text-sm">
                          {isOpLoading
                            ? '...'
                            : originality([...deck.cards, ...(deck.jokers ?? [])], opMap)}
                          P
                        </span>
                        <span className="text-gray-400 text-sm">{deck.cards.length}枚</span>
                      </p>
                    </div>
                    {mainDeck?.id === deck.id && (
                      <span className="text-blue-300 text-xs">現在のメインデッキ</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsDeckListOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deck Preview Modal */}
      {isPreviewOpen && mainDeck && (
        <DeckPreview
          deck={{
            cards: convertToICards(mainDeck.cards),
            joker: mainDeck.jokers ? convertToICards(mainDeck.jokers) : undefined,
          }}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};
